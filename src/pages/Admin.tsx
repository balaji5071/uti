import { useState, useEffect } from 'react';
import { Power, Loader, Trash } from 'lucide-react';
import { supabase, Review } from '../lib/supabase';

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
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [shopStatusError, setShopStatusError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    fetchShopStatus();
    fetchBookings();
    fetchReviews();
  }, []);

  // --------------------- SHOP STATUS ---------------------
  const fetchShopStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_status')
        .select('is_open')
        .maybeSingle();

      if (error) {
        console.info('[supabase] shop_status fetch failed:', error);
        setShopStatusError('shop_status table missing or inaccessible.');
      } else if (data) {
        setIsOpen(data.is_open);
      }
    } catch (err: any) {
      console.info('[supabase] unexpected:', err);
      setShopStatusError('Failed to fetch shop status.');
    }

    setLoading(false);
  };

  const toggleShopStatus = async () => {
    setUpdating(true);
    setShopStatusError(null);

    const { data: currentStatus, error: fetchErr } = await supabase
      .from('shop_status')
      .select('id, is_open')
      .maybeSingle();

    if (fetchErr) {
      console.error('[supabase] failed to read shop_status:', fetchErr);
      setShopStatusError('Failed to read shop status.');
      setUpdating(false);
      return;
    }

    if (currentStatus) {
      const { error } = await supabase
        .from('shop_status')
        .update({
          is_open: !currentStatus.is_open,
          updated_at: new Date().toISOString(),
          updated_by: 'admin',
        })
        .eq('id', currentStatus.id);

      if (error) {
        console.error('[supabase] update failed:', error);
        setShopStatusError('Failed to update shop status.');
      } else {
        await fetchShopStatus();
      }
    }

    setUpdating(false);
  };

  // --------------------- BOOKINGS ---------------------
  const fetchBookings = async () => {
    setLoadingBookings(true);
    setBookingsError(null);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setBookingsError(error.message);
        setBookings([]);
      } else {
        setBookings(data as Booking[]);
      }
    } catch (err: any) {
      setBookingsError(err.message);
      setBookings([]);
    }

    setLoadingBookings(false);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (!error) fetchBookings();
  };

  const messageCustomer = (phone: string, name: string) => {
    const number = phone.replace(/\D/g, '');
    const msg = `Hello ${name}, this is UTII Beauty Parlour. We received your booking request — we'll confirm shortly.`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const seedTestBooking = async () => {
    const { error } = await supabase.from('bookings').insert([
      {
        customer_name: 'Dev Test',
        phone: '+919876543210',
        service: 'Test Service',
        preferred_date: new Date().toISOString().split('T')[0],
        preferred_time: '12:00',
        notes: 'Seeded from admin UI',
        deposit_amount: 100,
        deposit_paid: false,
        status: 'pending',
      },
    ]);

    if (!error) fetchBookings();
  };

  // --------------------- REVIEWS ---------------------
  const fetchReviews = async () => {
    setLoadingReviews(true);
    setReviewsError(null);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setReviewsError(error.message);
        setReviews([]);
      } else {
        setReviews(data as Review[]);
      }
    } catch (err: any) {
      setReviewsError(err.message);
      setReviews([]);
    }

    setLoadingReviews(false);
  };

  const deleteReview = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete review: ' + error.message);
    } else {
      fetchReviews();
    }
  };

  // --------------------- UI ---------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <Loader className="h-12 w-12 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-lg text-gray-600">Manage everything</p>
        </div>

        {/* ---------------- SHOP STATUS ---------------- */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop Status</h2>
              <p className="text-gray-600">Control whether customers see the shop as open or closed.</p>
            </div>
            <Power className="h-12 w-12 text-rose-500" />
          </div>

          {onLogout && (
            <div className="flex justify-end mb-4">
              <button onClick={onLogout} className="text-sm text-gray-600 hover:text-gray-800 underline">
                Logout
              </button>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Status</p>
                <div
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                    isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  } font-semibold text-lg`}
                >
                  <span className={`h-3 w-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>{isOpen ? 'Open' : 'Closed'}</span>
                </div>
              </div>

              <button
                onClick={toggleShopStatus}
                disabled={updating}
                className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                  isOpen ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                } disabled:opacity-50`}
              >
                {updating ? <Loader className="h-5 w-5 animate-spin" /> : isOpen ? 'Close Shop' : 'Open Shop'}
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- REVIEWS ---------------- */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Reviews</h2>

          {loadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-rose-500 animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">
                      {r.customer_name} — <span className="text-sm">{r.rating}★</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{r.review_text}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(r.created_at).toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => deleteReview(r.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md flex items-center space-x-2"
                  >
                    <Trash className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------- BOOKINGS ---------------- */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Bookings</h2>

          {loadingBookings ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-rose-500 animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div>
              <p className="text-gray-600">No bookings yet.</p>
              <button onClick={seedTestBooking} className="mt-4 px-4 py-2 bg-rose-500 text-white rounded">
                Seed Test Booking
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <p className="font-semibold">{b.customer_name} — {b.service}</p>
                    <p className="text-sm text-gray-600">{b.preferred_date} @ {b.preferred_time}</p>
                    {b.notes && <p className="text-sm mt-1">{b.notes}</p>}
                    <p className="text-sm mt-2">Status: <span className="font-medium">{b.status}</span></p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button onClick={() => messageCustomer(b.phone, b.customer_name)} className="px-3 py-2 bg-green-500 text-white rounded">
                      Message
                    </button>
                    <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="px-3 py-2 bg-rose-500 text-white rounded">
                      Confirm
                    </button>
                    <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="px-3 py-2 bg-gray-300 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
