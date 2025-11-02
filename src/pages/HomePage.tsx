import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Company, Service } from '../types/database';

export const HomePage: React.FC = () => {
  const [companies, setCompanies] = useState<(Company & { services: Service[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (companiesError) throw companiesError;

      const companiesWithServices = await Promise.all(
        (companiesData || []).map(async (company) => {
          const { data: services } = await supabase
            .from('services')
            .select('*')
            .eq('company_id', company.id)
            .eq('is_active', true)
            .order('price');

          return { ...company, services: services || [] };
        })
      );

      setCompanies(companiesWithServices);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.title')}</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">
                    {company.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h3>

                {company.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {company.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {company.location_city && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{company.location_city}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                      {company.category}
                    </span>
                  </div>
                </div>

                {company.services.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Services
                    </h4>
                    <div className="space-y-2">
                      {company.services.slice(0, 3).map((service) => (
                        <div key={service.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-gray-700">{service.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {t('home.priceFrom')} {formatPrice(service.price, service.currency)}
                          </span>
                        </div>
                      ))}
                      {company.services.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{company.services.length - 3} more services
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No businesses found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};
