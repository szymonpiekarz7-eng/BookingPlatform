import React from 'react';
import { Globe, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Currency, Language } from '../types/database';

interface NavbarProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onShowLogin, onShowRegister }) => {
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">BookingPlatform</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-gray-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="pl">Polski</option>
              </select>
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={t('common.currency')}
            >
              <option value="PLN">PLN</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">{profile?.full_name}</span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  title={t('nav.logout')}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onShowLogin}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('nav.login')}
                </button>
                <button
                  onClick={onShowRegister}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('nav.register')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
