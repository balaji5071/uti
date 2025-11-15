import { useState, useEffect } from 'react';
import { Power, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchShopStatus();
  }, []);

  const fetchShopStatus = async () => {
    const { data, error } = await supabase
      .from('shop_status')
      .select('is_open')
      .maybeSingle();

    if (data && !error) {
      setIsOpen(data.is_open);
    }
    setLoading(false);
  };

  const toggleShopStatus = async () => {
    setUpdating(true);

    const { data: currentStatus } = await supabase
      .from('shop_status')
      .select('id, is_open')
      .maybeSingle();

    if (currentStatus) {
      const { error } = await supabase
        .from('shop_status')
        .update({
          is_open: !currentStatus.is_open,
          updated_at: new Date().toISOString(),
          updated_by: 'admin',
        })
        .eq('id', currentStatus.id);

      if (!error) {
        setIsOpen(!currentStatus.is_open);
      }
    }

    setUpdating(false);
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
      </div>
    </div>
  );
}
