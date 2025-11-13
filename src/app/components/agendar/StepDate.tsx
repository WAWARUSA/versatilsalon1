'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

interface StepDateProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

// Generate next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const months = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export default function StepDate({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: StepDateProps) {
  const dates = generateDates();

  const formatDate = (date: Date) => {
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
          Selecciona fecha y hora
        </h2>
        <p className="text-gray-400">
          Elige el día y horario que mejor te convenga
        </p>
      </div>

      {/* Date Selection */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-[#c9a857]" />
          <h3 className="text-lg font-semibold text-white">Fecha</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {dates.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const isTodayDate = isToday(date);

            return (
              <motion.button
                key={dateStr}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectDate(dateStr)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-300
                  ${
                    isSelected
                      ? 'border-[#c9a857] bg-[#c9a857] text-[#1c1b1b] shadow-lg shadow-[#c9a857]/20'
                      : 'border-[#151414] bg-[#151414] text-white hover:border-[#c9a857]/50'
                  }
                  ${isTodayDate && !isSelected ? 'ring-2 ring-[#c9a857]/30' : ''}
                `}
              >
                <div className="text-center">
                  <div className="text-xs font-medium mb-1">
                    {days[date.getDay()]}
                  </div>
                  <div className="text-lg font-bold">{date.getDate()}</div>
                  <div className="text-xs mt-1">{months[date.getMonth()]}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-[#c9a857]" />
            <h3 className="text-lg font-semibold text-white">Hora</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {timeSlots.map((time, index) => {
              // Simulate some unavailable slots
              const isAvailable = index % 4 !== 2;
              const isSelected = selectedTime === time;

              if (!isAvailable) {
                return (
                  <button
                    key={time}
                    disabled
                    className="p-3 rounded-lg border-2 border-[#151414] bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                  >
                    {time}
                  </button>
                );
              }

              return (
                <motion.button
                  key={time}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectTime(time)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-300 font-medium
                    ${
                      isSelected
                        ? 'border-[#c9a857] bg-[#c9a857] text-[#1c1b1b] shadow-lg shadow-[#c9a857]/20'
                        : 'border-[#151414] bg-[#151414] text-white hover:border-[#c9a857]/50'
                    }
                  `}
                >
                  {time}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {!selectedDate && (
        <div className="text-center py-8 text-gray-500">
          <p>Primero selecciona una fecha</p>
        </div>
      )}
    </motion.div>
  );
}

