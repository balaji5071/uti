import { useState, useEffect, FormEvent } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { supabase, Review } from '../lib/supabase';
import Seo from '../components/Seo';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    review: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setReviews(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('reviews').insert([
      {
        customer_name: formData.name,
        rating: formData.rating,
        review_text: formData.review,
      },
    ]);

    if (!error) {
      setFormData({ name: '', rating: 5, review: '' });
      setShowForm(false);
      alert('Thank you for your review! It will be visible shortly.');
      fetchReviews();
    } else {
      alert('Failed to submit review. Please try again.');
    }

    setIsSubmitting(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderInteractiveStars = (currentRating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400`}
            />
          </button>
        ))}
      </div>
    );
  };

  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0 ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewCount : 0;
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://utibeauty.com';

  return (
    <>
      <Seo
        title="Customer Reviews | UTI Beauty Parlour"
        description="Read real customer reviews for UTI Beauty Parlour and share your own beauty experience with our team."
        keywords={['beauty salon reviews', 'UTI Beauty feedback', 'customer testimonials', 'share beauty review']}
        path="/#reviews"
        structuredData={
          reviewCount
            ? {
                '@context': 'https://schema.org',
                '@type': 'BeautySalon',
                name: 'UTI Beauty Parlour',
                url: siteUrl,
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: averageRating.toFixed(1),
                  reviewCount,
                },
              }
            : undefined
        }
      />
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Customer Reviews
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              See what our valued clients have to say about their experience
            </p>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Write a Review
              </button>
            )}
          </div>

          {showForm && (
            <div className="max-w-2xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Share Your Experience</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    Rating *
                  </label>
                  {renderInteractiveStars(formData.rating, (rating) =>
                    setFormData({ ...formData, rating })
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    required
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Share your experience with us..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {review.customer_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <MessageSquare className="h-6 w-6 text-rose-500" />
                  </div>

                  <div className="mb-4">{renderStars(review.rating)}</div>

                  <p className="text-gray-600 leading-relaxed">{review.review_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
