import { Scissors, Palette, Sparkles, Heart, Crown, Hand } from 'lucide-react';
import { useState } from 'react';
import BookingModal from '../components/BookingModal';
import Seo from '../components/Seo';

export default function Services() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const services = [
    {
      icon: Scissors,
      category: 'Hair Services',
      items: [
  { name: 'Hair Cutting', price: 'Price on consultation' },
        { name: 'Hair Coloring', price: '₹2,000–₹3,000' },
      ],
    },
    {
      icon: Sparkles,
      category: 'Facial & Skin Care',
      items: [
        { name: 'Gold Facial', price: '₹500–₹600' },
      ],
    },
    {
      icon: Crown,
      category: 'Bridal Packages',
      items: [
        { name: 'Bridal Makeup', price: '₹4,000–₹5,000' },
        { name: 'Engagement Makeup', price: '₹2,000–₹3,000' },
        { name: 'Bridal Mehndi', price: '₹800–₹1,000' },
      ],
    },
    {
      icon: Palette,
      category: 'Makeup Services',
      items: [
        { name: 'Party Makeup', price: '₹1,500–₹2,000' },
        { name: 'Natural Makeup', price: '₹1,500–₹2,000' },
      ],
    },
    {
      icon: Hand,
      category: 'Hands & Feet',
      items: [
        { name: 'Nail Art', price: '₹200–₹300' },
      ],
    },
    {
      icon: Heart,
      category: 'Other Services',
      items: [
        { name: 'Threading', price: '₹25–₹30' },
        { name: 'Bleach', price: '₹150–₹200' },
        { name: 'Mehndi / Henna', price: '₹150–₹200' },
      ],
    },
  ];

  return (
    <>
      <Seo
        title="Beauty Services & Pricing"
        description="Browse UTI Beauty Parlour's full list of hair, makeup, facial, bridal, and nail services with transparent starting prices."
        keywords={['beauty services', 'haircut pricing', 'bridal packages', 'facial treatments', 'UTI Beauty Parlour services']}
        path="/#services"
      />
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive range of beauty services designed to make you look and feel your best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6">
                    <Icon className="h-10 w-10 text-white mb-2" />
                    <h3 className="text-2xl font-bold text-white">{service.category}</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {service.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-rose-600 font-semibold text-sm">
                            {item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Special Packages Available
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Ask about our monthly packages and combo offers for extra savings!
            </p>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-white text-rose-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Book Your Service Now
            </button>
          </div>
        </div>

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      </div>
    </>
  );
}
