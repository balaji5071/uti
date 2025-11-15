import { Award, Users, Clock, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            About UTII Beauty Parlour
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted destination for all beauty needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="flex items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                UTII Beauty Parlour was founded with a vision to provide exceptional beauty services
                that enhance natural beauty and boost confidence. We believe that every person
                deserves to look and feel their absolute best.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                With years of experience in the beauty industry, our team of skilled professionals
                is dedicated to delivering personalized services using premium products and the
                latest techniques.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We take pride in creating a warm, welcoming environment where our clients can relax
                and enjoy a luxurious beauty experience. Your satisfaction and comfort are our
                top priorities.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg"
              alt="Beauty Parlour"
              className="rounded-2xl shadow-2xl w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">10+</h3>
            <p className="text-gray-600">Years Experience</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">5000+</h3>
            <p className="text-gray-600">Happy Clients</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">6 Days</h3>
            <p className="text-gray-600">Open Weekly</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">100%</h3>
            <p className="text-gray-600">Satisfaction</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Why Choose UTII?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-rose-600 mb-3">Expert Team</h3>
              <p className="text-gray-600">
                Our beauticians are highly trained professionals with extensive experience and
                continuous training in the latest beauty trends and techniques.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-rose-600 mb-3">Premium Products</h3>
              <p className="text-gray-600">
                We use only high-quality, branded products that are gentle on your skin and
                deliver exceptional results.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-rose-600 mb-3">Hygiene Standards</h3>
              <p className="text-gray-600">
                We maintain strict hygiene protocols and use sterilized equipment to ensure
                your safety and comfort.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-rose-600 mb-3">Personalized Service</h3>
              <p className="text-gray-600">
                Every client receives individual attention and customized services tailored to
                their unique needs and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
