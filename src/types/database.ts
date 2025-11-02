export type UserRole = 'admin' | 'company' | 'client';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type NotificationType = 'email' | 'sms';

export type NotificationStatus = 'pending' | 'sent' | 'failed';

export type Currency = 'PLN' | 'EUR' | 'USD' | 'GBP';

export type Language = 'pl' | 'en';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  category: string;
  location_address?: string;
  location_city?: string;
  location_country: string;
  email?: string;
  phone?: string;
  is_active: boolean;
  subscription_tier: string;
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  currency: Currency;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  company_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

export interface ScheduleException {
  id: string;
  company_id: string;
  date: string;
  start_time?: string;
  end_time?: string;
  reason?: string;
  created_at: string;
}

export interface Reservation {
  id: string;
  company_id: string;
  service_id: string;
  client_id?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}
