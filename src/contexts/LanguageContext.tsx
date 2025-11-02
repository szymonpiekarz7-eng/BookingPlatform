import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/database';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'login.title': 'Login to your account',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.showPassword': 'Show password',
    'login.hidePassword': 'Hide password',
    'login.submit': 'Sign in',
    'login.forgotPassword': 'Forgot password?',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign up',
    'register.title': 'Create an account',
    'register.fullName': 'Full name',
    'register.phone': 'Phone number',
    'register.role': 'I am a',
    'register.roleClient': 'Client',
    'register.roleCompany': 'Business owner',
    'register.submit': 'Create account',
    'register.hasAccount': 'Already have an account?',
    'register.signIn': 'Sign in',
    'resetPassword.title': 'Reset password',
    'resetPassword.email': 'Email',
    'resetPassword.submit': 'Send reset link',
    'resetPassword.backToLogin': 'Back to login',
    'resetPassword.success': 'Password reset link sent to your email',
    'home.title': 'Book services easily',
    'home.subtitle': 'Find and book appointments with local businesses',
    'home.priceFrom': 'from',
    'schedule.monday': 'Monday',
    'schedule.tuesday': 'Tuesday',
    'schedule.wednesday': 'Wednesday',
    'schedule.thursday': 'Thursday',
    'schedule.friday': 'Friday',
    'schedule.saturday': 'Saturday',
    'schedule.sunday': 'Sunday',
    'schedule.save': 'Save schedule',
    'schedule.saved': 'Schedule saved successfully',
    'schedule.closed': 'Closed',
    'schedule.open': 'Open',
    'schedule.from': 'From',
    'schedule.to': 'To',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.currency': 'Currency',
  },
  pl: {
    'nav.home': 'Strona główna',
    'nav.login': 'Zaloguj się',
    'nav.register': 'Zarejestruj się',
    'nav.dashboard': 'Panel',
    'nav.logout': 'Wyloguj się',
    'login.title': 'Zaloguj się do konta',
    'login.email': 'Email',
    'login.password': 'Hasło',
    'login.showPassword': 'Pokaż hasło',
    'login.hidePassword': 'Ukryj hasło',
    'login.submit': 'Zaloguj się',
    'login.forgotPassword': 'Zapomniałeś hasła?',
    'login.noAccount': 'Nie masz konta?',
    'login.signUp': 'Zarejestruj się',
    'register.title': 'Utwórz konto',
    'register.fullName': 'Imię i nazwisko',
    'register.phone': 'Numer telefonu',
    'register.role': 'Jestem',
    'register.roleClient': 'Klientem',
    'register.roleCompany': 'Właścicielem firmy',
    'register.submit': 'Utwórz konto',
    'register.hasAccount': 'Masz już konto?',
    'register.signIn': 'Zaloguj się',
    'resetPassword.title': 'Resetuj hasło',
    'resetPassword.email': 'Email',
    'resetPassword.submit': 'Wyślij link resetujący',
    'resetPassword.backToLogin': 'Powrót do logowania',
    'resetPassword.success': 'Link resetujący hasło został wysłany na email',
    'home.title': 'Rezerwuj usługi łatwo',
    'home.subtitle': 'Znajdź i zarezerwuj wizyty w lokalnych firmach',
    'home.priceFrom': 'od',
    'schedule.monday': 'Poniedziałek',
    'schedule.tuesday': 'Wtorek',
    'schedule.wednesday': 'Środa',
    'schedule.thursday': 'Czwartek',
    'schedule.friday': 'Piątek',
    'schedule.saturday': 'Sobota',
    'schedule.sunday': 'Niedziela',
    'schedule.save': 'Zapisz grafik',
    'schedule.saved': 'Grafik zapisany pomyślnie',
    'schedule.closed': 'Zamknięte',
    'schedule.open': 'Otwarte',
    'schedule.from': 'Od',
    'schedule.to': 'Do',
    'common.loading': 'Ładowanie...',
    'common.error': 'Wystąpił błąd',
    'common.success': 'Sukces',
    'common.currency': 'Waluta',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'pl' || saved === 'en') return saved;

    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('pl') ? 'pl' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageState, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
