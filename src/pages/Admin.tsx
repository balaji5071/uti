import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, Loader, Trash } from 'lucide-react';
import { supabase, Review } from '../lib/supabase';
import AdminNavigation, { AdminSection } from '../components/AdminNavigation';

type Booking = {
  id: string;
  customer_name: string;
  phone: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
  deposit_amount: number;
  deposit_paid: boolean;
  status: string;
  created_at: string;
};

export default function Admin({ onLogout }: { onLogout?: () => void }) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [shopStatusError, setShopStatusError] = useState<string | null>(null);

  // BOOKINGS
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // REVIEWS
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // ------------------ SECTION HANDLING ------------------
  const initialSection = () => {
    if (typeof window === "undefined") return "overview";
    return (localStorage.getItem("adminSection") as AdminSection) || "overview";
  };

  const [activeSection, setActiveSection] =
    useState<AdminSection>(initialSection());

  useEffect(() => {
    localStorage.setItem("adminSection", activeSection);
  }, [activeSection]);

  // ------------------ LOAD DATA ------------------
  useEffect(() => {
    fetchShopStatus();
    fetchBookings();
    fetchReviews();
  }, []);

  // ------------------ SHOP STATUS ------------------
  const fetchShopStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("shop_status")
        .select("is_open")
        .maybeSingle();

      if (!error && data) setIsOpen(data.is_open);
      if (error) setShopStatusError(error.message);
    } catch {
      setShopStatusError("Failed to load shop status");
    }

    setLoading(false);
  };

  const toggleShopStatus = async () => {
    setUpdating(true);

    const { data: current } = await supabase
      .from("shop_status")
      .select("id, is_open")
      .maybeSingle();

    if (!current) return;

    await supabase
      .from("shop_status")
      .update({
        is_open: !current.is_open,
        updated_at: new Date().toISOString(),
        updated_by: "admin",
      })
      .eq("id", current.id);

    fetchShopStatus();
    setUpdating(false);
  };

  // ------------------ BOOKINGS ------------------
  const fetchBookings = async () => {
    setLoadingBookings(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setBookingsError(error.message);
    else setBookings(data as Booking[]);

    setLoadingBookings(false);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);

    if (error) {
      alert("Failed to update booking: " + error.message);
      return;
    }

    fetchBookings();
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) alert("Delete failed: " + error.message);
    else fetchBookings();
  };

  const messageCustomer = (phone: string, name: string) => {
    const num = phone.replace(/\D/g, "");
    const msg = `Hello ${name}, this is UTII Beauty Parlour. We received your booking request — we'll confirm shortly.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`);
  };

  // ------------------ REVIEWS ------------------
  const fetchReviews = async () => {
    setLoadingReviews(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setReviewsError(error.message);
    else setReviews(data as Review[]);

    setLoadingReviews(false);
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) alert("Delete failed: " + error.message);
    else fetchReviews();
  };

  // ------------------ UI SECTIONS ------------------
  const renderOverview = () => (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Shop Status</h2>

      <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl">
        <div>
          <p className="text-gray-600 mb-1">Current Status</p>
          <span
            className={`px-4 py-2 rounded-full font-semibold ${
              isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        <button
          onClick={toggleShopStatus}
          disabled={updating}
          className={`px-6 py-3 rounded-full text-white font-semibold ${
            isOpen ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {updating ? "Updating..." : isOpen ? "Close Shop" : "Open Shop"}
        </button>
      </div>

      {shopStatusError && (
        <p className="text-red-500 mt-3 text-sm">{shopStatusError}</p>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {loadingReviews ? (
        <Loader className="h-8 w-8 animate-spin" />
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="border p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">
                  {r.customer_name} — {r.rating}★
                </p>
                <p className="text-gray-600">{r.review_text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => deleteReview(r.id)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md flex items-center gap-2"
              >
                <Trash className="h-4 w-4" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {reviewsError && (
        <p className="text-red-500 mt-3 text-sm">{reviewsError}</p>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>

      {loadingBookings ? (
        <Loader className="h-8 w-8 animate-spin" />
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="border p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">
                  {b.customer_name} — {b.service}
                </p>

                {/* PHONE NUMBER */}
                <p className="text-gray-600">Phone: {b.phone}</p>

                <p className="text-gray-600">
                  {b.preferred_date} @ {b.preferred_time}
                </p>

                {b.notes && <p className="text-gray-700 mt-1">{b.notes}</p>}

                <p className="mt-2">
                  Status: <strong>{b.status}</strong>
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(b.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => messageCustomer(b.phone, b.customer_name)}
                  className="px-3 py-2 bg-green-500 text-white rounded"
                >
                  Message
                </button>

                <button
                  onClick={() => updateBookingStatus(b.id, "confirmed")}
                  className="px-3 py-2 bg-rose-500 text-white rounded"
                >
                  Confirm
                </button>

                <button
                  onClick={() => updateBookingStatus(b.id, "cancelled")}
                  className="px-3 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={() => deleteBooking(b.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded flex items-center gap-2"
                >
                  <Trash className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookingsError && (
        <p className="text-red-500 mt-3 text-sm">{bookingsError}</p>
      )}
    </div>
  );

  // ------------------ RENDER ------------------
  const sectionMap: Record<AdminSection, JSX.Element> = {
    overview: renderOverview(),
    reviews: renderReviews(),
    bookings: renderBookings(),
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-rose-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <AdminNavigation
        onLogout={onLogout}
        onBackToSite={() => navigate("/")}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {sectionMap[activeSection]}
      </div>
    </div>
  );
}
