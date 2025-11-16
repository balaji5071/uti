import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import AdminGuard from './components/AdminGuard';

function App() {
  const validPages = ['home', 'services', 'gallery', 'about', 'reviews', 'contact', 'admin'];

  const resolvePageFromHash = () => {
    try {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && validPages.includes(hash)) return hash;
    } catch (e) {
      // ignore
    }
    return null;
  };

  const resolveInitialPage = () => {
    // Priority: URL hash -> localStorage -> default 'home'
    const fromHash = resolvePageFromHash();
    if (fromHash) return fromHash;
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('currentPage') : null;
    if (stored && validPages.includes(stored)) return stored;
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(resolveInitialPage);

  // Keep state in sync with browser history (hash) so refresh/back-forward work
  useEffect(() => {
    const onHashChange = () => {
      const p = resolvePageFromHash();
      if (p) setCurrentPage(p);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (page: string) => {
    if (!validPages.includes(page)) page = 'home';
    setCurrentPage(page);
    try {
      window.localStorage.setItem('currentPage', page);
      // update URL hash for refresh/back-forward support
      if (window.location.hash.replace(/^#/, '') !== page) {
        window.location.hash = page;
      }
    } catch (e) {
      // ignore storage errors
    }
  };

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
        return <AdminGuard />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
  <Navigation currentPage={currentPage} onNavigate={navigate} />
  {renderPage()}

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 UTII Beauty Parlour. All rights reserved.</p>
          <p className="text-gray-400 text-sm">
            Made with love for beautiful transformations
          </p>
          <button
            onClick={() => navigate('admin')}
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
