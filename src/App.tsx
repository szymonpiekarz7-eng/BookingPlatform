import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';

type AuthView = 'login' | 'register' | 'reset' | null;

const AppContent: React.FC = () => {
  const [authView, setAuthView] = useState<AuthView>(null);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onShowLogin={() => setAuthView('login')}
        onShowRegister={() => setAuthView('register')}
      />

      {authView && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={() => setAuthView(null)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 z-10"
            >
              ✕
            </button>
            {authView === 'login' && (
              <LoginForm
                onSwitchToRegister={() => setAuthView('register')}
                onSwitchToReset={() => setAuthView('reset')}
              />
            )}
            {authView === 'register' && (
              <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
            )}
            {authView === 'reset' && (
              <ResetPasswordForm onBack={() => setAuthView('login')} />
            )}
          </div>
        </div>
      )}

      {user ? <DashboardPage /> : <HomePage />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <AppContent />
        </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
