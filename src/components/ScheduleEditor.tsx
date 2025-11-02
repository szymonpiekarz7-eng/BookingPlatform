import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { Schedule } from '../types/database';

interface ScheduleEditorProps {
  companyId: string;
}

interface DaySchedule {
  day_of_week: number;
  is_active: boolean;
  start_time: string;
  end_time: string;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ companyId }) => {
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { day_of_week: 0, is_active: false, start_time: '09:00', end_time: '17:00' },
    { day_of_week: 1, is_active: true, start_time: '09:00', end_time: '17:00' },
    { day_of_week: 2, is_active: true, start_time: '09:00', end_time: '17:00' },
    { day_of_week: 3, is_active: true, start_time: '09:00', end_time: '17:00' },
    { day_of_week: 4, is_active: true, start_time: '09:00', end_time: '17:00' },
    { day_of_week: 5, is_active: true, start_time: '09:00', end_time: '17:00' },
    { day_of_week: 6, is_active: false, start_time: '09:00', end_time: '17:00' },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const dayNames = [
    t('schedule.sunday'),
    t('schedule.monday'),
    t('schedule.tuesday'),
    t('schedule.wednesday'),
    t('schedule.thursday'),
    t('schedule.friday'),
    t('schedule.saturday'),
  ];

  useEffect(() => {
    loadSchedules();
  }, [companyId]);

  const loadSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;

      if (data && data.length > 0) {
        const scheduleMap = new Map(data.map(s => [s.day_of_week, s]));
        setSchedules(prev => prev.map(s => {
          const existing = scheduleMap.get(s.day_of_week);
          return existing ? {
            day_of_week: existing.day_of_week,
            is_active: existing.is_active,
            start_time: existing.start_time.substring(0, 5),
            end_time: existing.end_time.substring(0, 5),
          } : s;
        }));
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (dayIndex: number) => {
    setSchedules(prev => prev.map((s, i) =>
      i === dayIndex ? { ...s, is_active: !s.is_active } : s
    ));
  };

  const handleTimeChange = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setSchedules(prev => prev.map((s, i) =>
      i === dayIndex ? { ...s, [field]: value } : s
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      for (const schedule of schedules) {
        const { error } = await supabase
          .from('schedules')
          .upsert({
            company_id: companyId,
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            is_active: schedule.is_active,
          }, {
            onConflict: 'company_id,day_of_week'
          });

        if (error) throw error;
      }

      setMessage(t('schedule.saved'));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving schedules:', error);
      setMessage(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Schedule Editor</h2>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {schedules.map((schedule, index) => (
          <div key={schedule.day_of_week} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="w-32">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={schedule.is_active}
                  onChange={() => handleToggle(index)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-900">{dayNames[schedule.day_of_week]}</span>
              </label>
            </div>

            {schedule.is_active ? (
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">{t('schedule.from')}</label>
                  <input
                    type="time"
                    value={schedule.start_time}
                    onChange={(e) => handleTimeChange(index, 'start_time', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">{t('schedule.to')}</label>
                  <input
                    type="time"
                    value={schedule.end_time}
                    onChange={(e) => handleTimeChange(index, 'end_time', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 text-gray-500 italic">{t('schedule.closed')}</div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {saving ? t('common.loading') : t('schedule.save')}
      </button>
    </div>
  );
};
