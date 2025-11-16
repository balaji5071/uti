import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { useState } from 'react';
import BookingModal from '../components/BookingModal';

export default function Contact() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for appointments or inquiries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Visit Us</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                  <p className="text-gray-600">
                    UTI Beauty Parlour<br />
                    QPGV+MX5, Ambedkar chowk<br />
                    Ambagarh Chowki, Chhattisgarh - 491665
                  </p>
                </div>  
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                  <p className="text-gray-600">+91 9346163673</p>
                  <p className="text-gray-600">+91 9346163673</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-rose-600" />
                </div>
                
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Business Hours</h3>
                  <p className="text-gray-600">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="mt-8 w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Book Appointment via WhatsApp
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Location</h2>
            <div className="rounded-2xl overflow-hidden shadow-xl h-[500px]">
              <iframe
                src="https://www.google.com/maps?q=QPGV%2BMX5%2C%20Ambedkar%20chowk%2C%20Ambagarh%20Chowki%2C%20Chhattisgarh%20491665&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="UTI Beauty Parlour Location"
              />
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=QPGV%2BMX5%2C%20Ambedkar%20chowk%2C%20Ambagarh%20Chowki%2C%20Chhattisgarh%20491665"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full bg-white border-2 border-rose-500 text-rose-600 px-8 py-3 rounded-full text-center font-semibold hover:bg-rose-50 transition-all duration-300"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Visit?</h2>
          <p className="text-lg mb-6 opacity-90">
            We look forward to welcoming you to UTI Beauty Parlour!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="tel:+911234567890"
              className="bg-white text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Call Now
            </a>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-white text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Book via WhatsApp
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
