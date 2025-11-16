import { useState } from 'react';
import { ShieldCheck, ArrowLeft, LogOut } from 'lucide-react';

export type AdminSection = 'overview' | 'reviews' | 'bookings';

interface AdminNavigationProps {
  onBackToSite: () => void;
  onLogout?: () => void;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export default function AdminNavigation({ onBackToSite, onLogout, activeSection, onSectionChange }: AdminNavigationProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const sectionLinks: { id: AdminSection; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'bookings', label: 'Bookings' },
  ];

  const renderSectionButtons = (extraClass = '') => (
    <div className={`items-center space-x-1 text-sm font-medium text-gray-600 ${extraClass}`}>
      {sectionLinks.map((link) => (
        <button
          key={link.id}
          onClick={() => onSectionChange(link.id)}
          className={`px-3 py-2 rounded-lg transition-colors ${
            activeSection === link.id
              ? 'bg-rose-100 text-rose-600'
              : 'hover:bg-rose-50 hover:text-rose-600'
          }`}
        >
          {link.label}
        </button>
      ))}
    </div>
  );

  return (
    <header className="bg-white/90 backdrop-blur border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between space-x-4">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-100 text-rose-600 rounded-full p-2">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-rose-400">UTI Beauty</p>
            <p className="text-lg font-semibold text-gray-800">Admin Dashboard</p>
          </div>
        </div>

        <nav className="hidden md:flex">{renderSectionButtons()}</nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToSite}
            className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>View Website</span>
          </button>

          {onLogout && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-rose-500 text-white text-sm hover:bg-rose-600 shadow"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          )}
        </div>

        <div className="w-full mt-3 md:hidden flex flex-wrap gap-2">
          {sectionLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSectionChange(link.id)}
              className={`flex-1 min-w-[110px] px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                activeSection === link.id
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-full bg-rose-100 text-rose-600">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Sign out?</p>
                <p className="text-sm text-gray-500">You can always log back in later.</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              This will end your admin session and return you to the site.
            </p>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout?.();
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 shadow"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
