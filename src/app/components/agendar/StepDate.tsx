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

type DayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

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
  status?: string; // 'confirmed', 'completed', 'cancelled', 'blocked', 'pending'
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

// Generar slots de 30 minutos desde las 11:00 hasta las 19:00 (como en la app de escritorio)
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 11 * 60; i <= 19 * 60; i += 30) {
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

      if (!db) {
        setIsLoadingSchedule(false);
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
            const scheduleData = scheduleSnap.data() as WorkerSchedule;
            setWorkerSchedule(scheduleData);
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

      if (!db) {
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

      if (!db) {
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
        const allAppointments: Appointment[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            startTime: data.startTime.toDate(),
            endTime: data.endTime.toDate(),
            performedBy: (data.performedBy as string) || '',
            status: (data.status as string) || 'confirmed', // Por defecto 'confirmed' si no tiene status
            ...data,
          } as Appointment;
        });

        // Filtrar por performedBy en el código (más eficiente que múltiples where)
        // Solo incluir appointments que pertenezcan al worker y que no estén cancelados
        // Usar trim() y comparación case-insensitive para evitar problemas de espacios/Mayúsculas
        const appointments = allAppointments.filter(app => {
          const appPerformedBy = (app.performedBy || '').trim();
          const workerNameTrimmed = (workerName || '').trim();
          const matches = appPerformedBy.toLowerCase() === workerNameTrimmed.toLowerCase();
          const isNotCancelled = app.status !== 'cancelled';
          return matches && isNotCancelled;
        });
        
        // Debug: mostrar información de los appointments cargados
        console.log(`[DEBUG] ========== CARGANDO APPOINTMENTS ==========`);
        console.log(`[DEBUG] Fecha seleccionada: ${selectedDate}`);
        console.log(`[DEBUG] Worker Name buscado: "${workerName}"`);
        console.log(`[DEBUG] Total appointments en el día: ${allAppointments.length}`);
        console.log(`[DEBUG] Appointments filtrados (performedBy === workerName): ${appointments.length}`);
        
        // Mostrar todos los appointments para debug
        allAppointments.forEach(app => {
          const matches = app.performedBy === workerName;
          console.log(`[DEBUG] - Appointment: ${app.startTime.toLocaleString()} - ${app.endTime.toLocaleString()}`);
          console.log(`[DEBUG]   Status: ${app.status}, PerformedBy: "${app.performedBy}"`);
          console.log(`[DEBUG]   ¿Coincide con "${workerName}"? ${matches ? '✅ SÍ' : '❌ NO'}`);
        });
        
        if (appointments.length === 0 && allAppointments.length > 0) {
          console.warn(`[DEBUG] ⚠️ Hay ${allAppointments.length} appointments pero ninguno coincide con el worker "${workerName}"`);
        }
        
        setExistingAppointments(appointments);
      } catch (error) {
        console.error('Error cargando appointments:', error);
        setExistingAppointments([]);
      }
    };

    loadAppointments();
  }, [selectedDate, workerName, db]);

  // Verificar si un horario está disponible
  const isTimeSlotAvailable = (timeSlot: string): boolean => {
    if (!selectedDate || !workerSchedule || !workerName) return false;

    const date = new Date(selectedDate);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Ajustar para que Lunes = 0
    const dayName = DAYS_OF_WEEK[dayIndex] as DayName;
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
    // Permitir que termine exactamente a la hora de cierre (>= en lugar de >)
    const slotEndMinutes = slotTotalMinutes + serviceDuration;
    if (slotEndMinutes > endTotalMinutes) {
      return false;
    }

    // Verificar conflictos con appointments existentes
    // Crear fecha del slot
    const slotDate = new Date(selectedDate + 'T00:00:00');
    const slotTime = new Date(slotDate);
    slotTime.setHours(slotHours, slotMinutes, 0, 0);
    const slotEndTime = new Date(slotTime.getTime() + serviceDuration * 60000);

    // Debug: mostrar cuántos appointments hay
    console.log(`[DEBUG] ========== VERIFICANDO DISPONIBILIDAD ==========`);
    console.log(`[DEBUG] Horario: ${timeSlot}`);
    console.log(`[DEBUG] Appointments a verificar: ${existingAppointments.length}`);
    
    if (existingAppointments.length === 0) {
      console.log(`[DEBUG] ✅ No hay appointments, horario disponible`);
    }

    for (const appointment of existingAppointments) {
      // Ignorar solo appointments cancelados
      // Todos los demás estados (confirmed, completed, blocked, pending) bloquean el horario
      const status = (appointment.status || 'confirmed').toLowerCase();
      if (status === 'cancelled') {
        console.log(`[DEBUG]   Ignorando appointment cancelado`);
        continue;
      }

      // Obtener fechas del appointment
      const appStart = new Date(appointment.startTime);
      const appEnd = new Date(appointment.endTime);

      // Comparar solo la fecha (sin hora) para verificar que sea el mismo día
      const slotDateOnly = new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate());
      const appStartDateOnly = new Date(appStart.getFullYear(), appStart.getMonth(), appStart.getDate());
      const appEndDateOnly = new Date(appEnd.getFullYear(), appEnd.getMonth(), appEnd.getDate());

      // Si el appointment no es del mismo día, ignorarlo
      if (appStartDateOnly.getTime() !== slotDateOnly.getTime() && appEndDateOnly.getTime() !== slotDateOnly.getTime()) {
        continue;
      }

      // Extraer solo horas y minutos para comparar
      const slotStartMinutes = slotHours * 60 + slotMinutes;
      const slotEndMinutes = slotStartMinutes + serviceDuration;
      
      const appStartMinutes = appStart.getHours() * 60 + appStart.getMinutes();
      const appEndMinutes = appEnd.getHours() * 60 + appEnd.getMinutes();

      // Verificar solapamiento: dos rangos se solapan si:
      // slotStart < appEnd && slotEnd > appStart
      const hasOverlap = slotStartMinutes < appEndMinutes && slotEndMinutes > appStartMinutes;

      if (hasOverlap) {
        console.log(`[DEBUG] ❌ CONFLICTO DETECTADO:`);
        console.log(`[DEBUG]   Slot: ${timeSlot} (${slotStartMinutes}min - ${slotEndMinutes}min)`);
        console.log(`[DEBUG]   Appointment: ${appStartMinutes}min - ${appEndMinutes}min`);
        console.log(`[DEBUG]   Status: ${appointment.status}`);
        return false; // Hay conflicto, el horario no está disponible
      } else {
        console.log(`[DEBUG] ✅ Sin conflicto: Slot ${timeSlot} no se solapa con appointment ${appStartMinutes}min-${appEndMinutes}min`);
      }
    }

    console.log(`[DEBUG] ✅ Horario ${timeSlot} DISPONIBLE`);
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

