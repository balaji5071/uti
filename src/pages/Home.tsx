import { useState, useEffect } from 'react';
import { Calendar, Award, Users, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BookingModal from '../components/BookingModal';

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopStatus();

    const subscription = supabase
      .channel('shop_status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shop_status',
        },
        (payload) => {
          setIsOpen(payload.new.is_open);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6">
            {!loading && (
              <div
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                  isOpen
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                } font-medium animate-pulse`}
              >
                <span
                  className={`h-3 w-3 rounded-full ${
                    isOpen ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span>{isOpen ? 'UTII is Open Now' : 'UTII is Closed Now'}</span>
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            UTII Beauty Parlour
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Where Beauty Meets Excellence
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience professional beauty services in a luxurious and comfortable environment.
            Your satisfaction is our priority.
          </p>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book Appointment via WhatsApp
          </button>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Professionals</h3>
              <p className="text-gray-600">
                Highly trained beauticians with years of experience in the industry.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Products</h3>
              <p className="text-gray-600">
                We use only the finest quality products for all our services.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Happy Clients</h3>
              <p className="text-gray-600">
                Thousands of satisfied customers trust us for their beauty needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-rose-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Calendar className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Look?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your appointment now and experience the UTII difference
          </p>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-white text-rose-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book Now
          </button>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
