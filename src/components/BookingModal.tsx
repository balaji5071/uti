import { X, Calendar, Clock } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });
  const DEPOSIT = 100; // INR
  const [depositAccepted, setDepositAccepted] = useState(false);

  const services = [
    'Haircut & Styling',
    'Hair Coloring',
    'Facial Treatment',
    'Bridal Makeup',
    'Party Makeup',
    'Manicure & Pedicure',
    'Threading & Waxing',
    'Hair Spa',
    'Skin Treatment',
    'Mehndi/Henna',
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!depositAccepted) {
      // Shouldn't happen because checkbox is required, but guard anyway
      alert(`Please accept the pre-booking deposit of ₹${DEPOSIT}.`);
      return;
    }
    // Persist booking to the `bookings` table (best-effort). If Supabase isn't configured,
    // the stub client will return an error object and we silently continue to open WhatsApp.
    let persistError: string | null = null;
    (async () => {
      try {
        const { error } = await supabase.from('bookings').insert([
          {
            customer_name: formData.name,
            phone: formData.phone,
            service: formData.service,
            preferred_date: formData.date,
            preferred_time: formData.time,
            notes: formData.notes,
            deposit_amount: DEPOSIT,
            deposit_paid: false,
            status: 'pending',
          },
        ]);
        if (error) persistError = error.message;
      } catch (err: any) {
        persistError = err?.message || String(err);
      } finally {
        if (persistError) {
          // Show a non-blocking alert to the user so they're aware booking wasn't saved server-side
          alert('Warning: booking could not be saved to server: ' + persistError + '\nWhatsApp will still open so you can confirm with us.');
        }
      }
    })();
  const message = `Hello UTII Beauty Parlour! I want to book an appointment.

Name: ${formData.name}
Phone: ${formData.phone}
Service: ${formData.service}
Preferred Date: ${formData.date}
Preferred Time: ${formData.time}
Notes: ${formData.notes || 'None'}

Pre-booking deposit: ₹${DEPOSIT} (will be deducted from the final bill)`;

    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    setFormData({
      name: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      notes: '',
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service *
            </label>
            <select
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Preferred Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Preferred Time *
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Any special requests or preferences..."
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              id="deposit"
              type="checkbox"
              checked={depositAccepted}
              onChange={(e) => setDepositAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 text-rose-600 border-gray-300 rounded"
            />
            <label htmlFor="deposit" className="text-sm text-gray-700">
              I accept to pay a pre-booking deposit of <strong>₹{DEPOSIT}</strong> which will be
              deducted from the final bill.
            </label>
          </div>

          <button
            type="submit"
            disabled={!depositAccepted}
            className={`w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl ${
              !depositAccepted ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Continue to WhatsApp (Pre-booking ₹{DEPOSIT})
          </button>
        </form>
      </div>
    </div>
  );
}
