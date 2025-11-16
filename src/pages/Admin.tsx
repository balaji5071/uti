import { useState, useEffect } from 'react';
import { Power, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    fetchShopStatus();
    fetchBookings();
  }, []);

  const fetchShopStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_status')
        .select('is_open')
        .maybeSingle();

      if (error) {
        // log info and surface a friendly message in the Admin UI
        // eslint-disable-next-line no-console
        console.info('[supabase] shop_status fetch failed:', error.message || error);
        setShopStatusError('shop_status table missing or inaccessible. Run migrations.');
      } else if (data) {
        setIsOpen(data.is_open);
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.info('[supabase] shop_status unexpected error:', err?.message || err);
      setShopStatusError('Failed to fetch shop status (network or configuration issue).');
    }

    setLoading(false);
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setBookingsError(null);
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (error) {
        setBookingsError(error.message || 'Failed to fetch bookings');
        setBookings([]);
      } else {
        setBookings((data as Booking[]) || []);
      }
    } catch (err: any) {
      setBookingsError(err?.message || String(err));
      setBookings([]);
    }
    setLoadingBookings(false);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) fetchBookings();
  };

  const messageCustomer = (phone: string, name: string) => {
    const whatsappNumber = phone.replace(/\D/g, '');
  const msg = `Hello ${name}, this is UTI Beauty Parlour. We received your booking request — we'll confirm shortly.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const seedTestBooking = async () => {
    try {
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
      if (error) {
        alert('Failed to seed booking: ' + error.message);
      } else {
        await fetchBookings();
      }
    } catch (err: any) {
      alert('Failed to seed booking: ' + err?.message);
    }
  };

  const toggleShopStatus = async () => {
    setUpdating(true);
    setShopStatusError(null);

    try {
      const { data: currentStatus, error: fetchErr } = await supabase
        .from('shop_status')
        .select('id, is_open')
        .maybeSingle();

      if (fetchErr) {
        // eslint-disable-next-line no-console
        console.error('[supabase] failed to read shop_status before update:', fetchErr.message || fetchErr);
        setShopStatusError('Failed to read shop status before update: ' + (fetchErr.message || String(fetchErr)));
        return;
      }

      if (currentStatus) {
        // Perform the update without requesting the updated representation.
        const { error } = await supabase
          .from('shop_status')
          .update({
            is_open: !currentStatus.is_open,
            updated_at: new Date().toISOString(),
            updated_by: 'admin',
          })
          .eq('id', currentStatus.id);

        if (error) {
          // eslint-disable-next-line no-console
          console.error('[supabase] failed to update shop_status:', error.message || error);
          setShopStatusError('Failed to update shop status: ' + (error.message || String(error)));
        } else {
          // Refresh authoritative value from DB so UI stays consistent
          await fetchShopStatus();
        }
      }
    } finally {
      setUpdating(false);
    }
  };

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
          <p className="text-lg text-gray-600">
            Manage shop status and settings
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop Status</h2>
              <p className="text-gray-600">
                Toggle the shop status to show customers if you're open or closed
              </p>
            </div>
            <Power className="h-12 w-12 text-rose-500" />
          </div>

          {onLogout && (
            <div className="flex justify-end mb-4">
              <button
                onClick={onLogout}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
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
                    isOpen
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  } font-semibold text-lg`}
                >
                  <span
                    className={`h-3 w-3 rounded-full ${
                      isOpen ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span>{isOpen ? 'Shop is Open' : 'Shop is Closed'}</span>
                </div>
              </div>
              {shopStatusError && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded">
                  {shopStatusError}
                </div>
              )}

              <button
                onClick={toggleShopStatus}
                disabled={updating}
                className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isOpen
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {updating ? (
                  <span className="flex items-center space-x-2">
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Updating...</span>
                  </span>
                ) : (
                  <span>{isOpen ? 'Close Shop' : 'Open Shop'}</span>
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• The shop status is displayed in real-time on the homepage</li>
              <li>• Customers can see if you're currently open or closed</li>
              <li>• Changes take effect immediately across all devices</li>
              <li>• Use this feature to manage customer expectations</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-2">Total Reviews</p>
              <p className="text-3xl font-bold">View Reviews Page</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white">
              <p className="text-sm opacity-90 mb-2">WhatsApp Number</p>
              <p className="text-xl font-semibold">Check .env file</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Bookings</h2>
          {loadingBookings ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-rose-500 animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div>
              <p className="text-gray-600">No bookings yet.</p>
              <div className="mt-4">
                <button
                  onClick={seedTestBooking}
                  className="px-4 py-2 bg-rose-500 text-white rounded-md"
                >
                  Seed test booking
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="border rounded-lg p-4 flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{b.customer_name} — {b.service}</div>
                    <div className="text-sm text-gray-600">{b.preferred_date} @ {b.preferred_time}</div>
                    {b.notes && <div className="text-sm text-gray-600 mt-1">{b.notes}</div>}
                    <div className="text-sm text-gray-600 mt-1">Status: <span className="font-medium">{b.status}</span></div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => messageCustomer(b.phone, b.customer_name)}
                      className="px-3 py-2 bg-green-500 text-white rounded-md text-sm"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'confirmed')}
                      className="px-3 py-2 bg-rose-500 text-white rounded-md text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="px-3 py-2 bg-gray-300 text-gray-800 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
            {bookingsError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                <div className="font-semibold">Error loading bookings</div>
                <div className="text-sm">{bookingsError}</div>
                <div className="mt-2">
                  <button onClick={fetchBookings} className="px-3 py-2 bg-rose-500 text-white rounded">Retry</button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
