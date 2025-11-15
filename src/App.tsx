import { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'services':
        return <Services />;
      case 'gallery':
        return <Gallery />;
      case 'about':
        return <About />;
      case 'reviews':
        return <Reviews />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 UTII Beauty Parlour. All rights reserved.</p>
          <p className="text-gray-400 text-sm">
            Made with love for beautiful transformations
          </p>
          <button
            onClick={() => setCurrentPage('admin')}
            className="mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Admin
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
