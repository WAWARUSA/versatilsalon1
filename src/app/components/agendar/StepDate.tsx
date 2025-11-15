'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface StepDateProps {
  selectedStylist: string | null;
  selectedService: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

interface DaySchedule {
  isEnabled: boolean;
  start: string;
  end: string;
}

interface WorkerSchedule {
  schedule: {
    monday?: DaySchedule;
    tuesday?: DaySchedule;
    wednesday?: DaySchedule;
    thursday?: DaySchedule;
    friday?: DaySchedule;
    saturday?: DaySchedule;
    sunday?: DaySchedule;
  };
}

interface Appointment {
  id: string;
  startTime: Date;
  endTime: Date;
  performedBy: string;
  [key: string]: unknown;
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

// Generar slots de 30 minutos desde las 11:00 hasta las 20:00 (como en la app de escritorio)
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 11 * 60; i < 20 * 60; i += 30) {
    const hours = Math.floor(i / 60);
    const minutes = i % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Días de la semana (igual que en la app de escritorio - EN INGLÉS)
// La app de escritorio guarda los schedules con nombres en inglés
const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
  selectedStylist,
  selectedService,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: StepDateProps) {
  const dates = generateDates();
  const [workerSchedule, setWorkerSchedule] = useState<WorkerSchedule | null>(null);
  const [workerName, setWorkerName] = useState<string>('');
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [serviceDuration, setServiceDuration] = useState<number>(60); // Duración por defecto en minutos
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Cargar nombre del worker y su schedule
  useEffect(() => {
    const loadWorkerData = async () => {
      if (!selectedStylist) {
        setWorkerSchedule(null);
        setWorkerName('');
        return;
      }

      setIsLoadingSchedule(true);
      try {
        // Obtener el worker
        const workerRef = doc(db, 'workers', selectedStylist);
        const workerSnap = await getDoc(workerRef);
        
        if (workerSnap.exists()) {
          const workerData = workerSnap.data();
          const name = workerData.name || '';
          setWorkerName(name);

          // Obtener el schedule del worker
          const scheduleRef = doc(db, 'workerSchedules', name);
          const scheduleSnap = await getDoc(scheduleRef);
          
          if (scheduleSnap.exists()) {
            setWorkerSchedule(scheduleSnap.data());
          } else {
            // Si no tiene schedule, usar horario por defecto (11:00 - 20:00 todos los días)
            // IMPORTANTE: usar nombres en inglés como la app de escritorio
            setWorkerSchedule({
              schedule: {
                monday: { isEnabled: true, start: '11:00', end: '20:00' },
                tuesday: { isEnabled: true, start: '11:00', end: '20:00' },
                wednesday: { isEnabled: true, start: '11:00', end: '20:00' },
                thursday: { isEnabled: true, start: '11:00', end: '20:00' },
                friday: { isEnabled: true, start: '11:00', end: '20:00' },
                saturday: { isEnabled: true, start: '11:00', end: '20:00' },
                sunday: { isEnabled: true, start: '11:00', end: '20:00' },
              }
            });
          }
        }
      } catch (error) {
        console.error('Error cargando datos del worker:', error);
      } finally {
        setIsLoadingSchedule(false);
      }
    };

    loadWorkerData();
  }, [selectedStylist]);

  // Cargar duración del servicio
  useEffect(() => {
    const loadServiceDuration = async () => {
      if (!selectedService) {
        setServiceDuration(60);
        return;
      }

      try {
        const serviceNameMap: Record<string, string> = {
          'corte': 'Corte de Cabello',
          'coloracion': 'Coloración',
          'peinado': 'Peinado',
          'manicure': 'Manicure',
          'tratamiento': 'Tratamiento Capilar',
          'premium': 'Servicios Premium',
        };
        
        const serviceDisplayName = serviceNameMap[selectedService] || selectedService;
        const servicesQuery = query(collection(db, 'services'), where('name', '==', serviceDisplayName));
        const servicesSnapshot = await getDocs(servicesQuery);
        
        if (!servicesSnapshot.empty) {
          const serviceData = servicesSnapshot.docs[0].data();
          setServiceDuration(serviceData.duration || 60);
        } else {
          setServiceDuration(60);
        }
      } catch (error) {
        console.error('Error cargando duración del servicio:', error);
        setServiceDuration(60);
      }
    };

    loadServiceDuration();
  }, [selectedService]);

  // Cargar appointments existentes cuando cambia la fecha
  useEffect(() => {
    const loadAppointments = async () => {
      if (!selectedDate || !workerName) {
        setExistingAppointments([]);
        return;
      }

      try {
        const date = new Date(selectedDate);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('startTime', '>=', Timestamp.fromDate(startOfDay)),
          where('startTime', '<=', Timestamp.fromDate(endOfDay))
        );

        const snapshot = await getDocs(appointmentsQuery);
        const allAppointments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startTime: doc.data().startTime.toDate(),
          endTime: doc.data().endTime.toDate(),
        }));

        // Filtrar por performedBy en el código (más eficiente que múltiples where)
        const appointments = allAppointments.filter(app => app.performedBy === workerName);
        setExistingAppointments(appointments);
      } catch (error) {
        console.error('Error cargando appointments:', error);
        setExistingAppointments([]);
      }
    };

    loadAppointments();
  }, [selectedDate, workerName]);

  // Verificar si un horario está disponible
  const isTimeSlotAvailable = (timeSlot: string): boolean => {
    if (!selectedDate || !workerSchedule || !workerName) return false;

    const date = new Date(selectedDate);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Ajustar para que Lunes = 0
    const dayName = DAYS_OF_WEEK[dayIndex];
    const daySchedule = workerSchedule.schedule?.[dayName];

    // Verificar si el día está habilitado
    if (!daySchedule || !daySchedule.isEnabled) return false;

    // Verificar si el horario está dentro del rango del worker
    const [slotHours, slotMinutes] = timeSlot.split(':').map(Number);
    const [startHours, startMinutes] = daySchedule.start.split(':').map(Number);
    const [endHours, endMinutes] = daySchedule.end.split(':').map(Number);

    const slotTotalMinutes = slotHours * 60 + slotMinutes;
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    if (slotTotalMinutes < startTotalMinutes || slotTotalMinutes >= endTotalMinutes) {
      return false;
    }

    // Verificar que el servicio completo quepa en el horario
    const slotEndMinutes = slotTotalMinutes + serviceDuration;
    if (slotEndMinutes > endTotalMinutes) {
      return false;
    }

    // Verificar conflictos con appointments existentes
    const slotTime = new Date(date);
    slotTime.setHours(slotHours, slotMinutes, 0, 0);
    const slotEndTime = new Date(slotTime.getTime() + serviceDuration * 60000);

    for (const appointment of existingAppointments) {
      // Verificar si hay solapamiento
      if (
        (slotTime >= appointment.startTime && slotTime < appointment.endTime) ||
        (slotEndTime > appointment.startTime && slotEndTime <= appointment.endTime) ||
        (slotTime <= appointment.startTime && slotEndTime >= appointment.endTime)
      ) {
        // Ignorar conflictos solo si el appointment está cancelado
        // Los appointments 'blocked', 'pending', 'confirmed', 'completed' bloquean el horario
        if (appointment.status !== 'cancelled') {
          return false;
        }
      }
    }

    return true;
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
      {!selectedStylist && (
        <div className="text-center py-8 text-gray-500">
          <p>Primero selecciona un estilista</p>
        </div>
      )}

      {selectedStylist && !selectedDate && (
        <div className="text-center py-8 text-gray-500">
          <p>Primero selecciona una fecha</p>
        </div>
      )}

      {selectedStylist && selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-[#c9a857]" />
            <h3 className="text-lg font-semibold text-white">Hora</h3>
            {isLoadingSchedule && (
              <span className="text-sm text-gray-400 ml-2">(Cargando disponibilidad...)</span>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {timeSlots.map((time, index) => {
              const isAvailable = isTimeSlotAvailable(time);
              const isSelected = selectedTime === time;

              if (!isAvailable) {
                return (
                  <button
                    key={time}
                    disabled
                    className="p-3 rounded-lg border-2 border-[#151414] bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                    title="Horario no disponible"
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
    </motion.div>
  );
}

