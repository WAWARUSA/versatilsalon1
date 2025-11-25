'use client';

import { useState, useEffect, useMemo } from 'react';
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
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar re-render

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
        setExistingAppointments([]);
        // Limpiar tiempo seleccionado cuando no hay trabajador
        if (selectedTime) {
          onSelectTime('');
        }
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

  // Cargar appointments existentes cuando cambia la fecha o el trabajador
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
        // Parsear la fecha sin problemas de zona horaria
        const [year, month, day] = selectedDate.split('-').map(Number);
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

        console.log('🔍 Buscando appointments para:', {
          fecha: selectedDate,
          trabajador: workerName,
          desde: startOfDay.toISOString(),
          hasta: endOfDay.toISOString()
        });

        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('startTime', '>=', Timestamp.fromDate(startOfDay)),
          where('startTime', '<=', Timestamp.fromDate(endOfDay))
        );

        const snapshot = await getDocs(appointmentsQuery);
        console.log(`📋 Total appointments encontrados en la fecha: ${snapshot.docs.length}`);

        const allAppointments: Appointment[] = snapshot.docs.map(doc => {
          const data = doc.data();
          // Asegurarse de que startTime y endTime existan antes de convertirlos
          if (!data.startTime || !data.endTime) {
            console.warn('⚠️ Appointment sin startTime o endTime:', doc.id, data);
            return null;
          }
          
          const startTimeDate = data.startTime.toDate();
          const endTimeDate = data.endTime.toDate();
          
          const appointment = {
            id: doc.id,
            startTime: startTimeDate,
            endTime: endTimeDate,
            performedBy: (data.performedBy as string) || '',
            status: (data.status as string) || 'confirmed',
            ...data,
          } as Appointment;

          console.log('📅 Appointment raw:', {
            id: doc.id,
            performedBy: appointment.performedBy,
            startTime: startTimeDate instanceof Date ? startTimeDate.toISOString() : String(startTimeDate),
            endTime: endTimeDate instanceof Date ? endTimeDate.toISOString() : String(endTimeDate),
            status: appointment.status
          });

          return appointment;
        }).filter((app): app is Appointment => app !== null);

        // Filtrar por performedBy en el código
        const workerNameTrimmed = (workerName || '').trim().toLowerCase();
        console.log('👤 Buscando appointments para trabajador:', workerNameTrimmed);

        const appointments = allAppointments.filter(app => {
          const appPerformedBy = (app.performedBy || '').trim().toLowerCase();
          const matches = appPerformedBy === workerNameTrimmed;
          const isNotCancelled = (app.status || 'confirmed').toLowerCase() !== 'cancelled';
          
          if (matches) {
            const startDate = app.startTime instanceof Date ? app.startTime : new Date(app.startTime);
            const endDate = app.endTime instanceof Date ? app.endTime : new Date(app.endTime);
            console.log('✅ Appointment MATCH encontrado:', {
              performedBy: app.performedBy,
              workerName: workerName,
              match: matches,
              status: app.status,
              isNotCancelled: isNotCancelled,
              start: `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`,
              end: `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
            });
          } else if (appPerformedBy) {
            console.log('❌ Appointment NO MATCH:', {
              appPerformedBy: appPerformedBy,
              workerName: workerNameTrimmed,
              diferencia: appPerformedBy !== workerNameTrimmed
            });
          }
          
          return matches && isNotCancelled;
        });
        
        console.log(`🎯 Total appointments ocupados para ${workerName} en ${selectedDate}: ${appointments.length}`);
        setExistingAppointments(appointments);
        // Forzar re-render actualizando el refreshKey
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('❌ Error cargando appointments:', error);
        setExistingAppointments([]);
        setRefreshKey(prev => prev + 1);
      }
    };

    loadAppointments();
  }, [selectedDate, workerName]);

  // Limpiar tiempo seleccionado si ya no está disponible cuando cambian los appointments
  useEffect(() => {
    if (!selectedTime || !selectedDate || !workerSchedule || !workerName) {
      return;
    }

    // Verificar si el tiempo seleccionado sigue disponible
    const checkAvailability = () => {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
      const dayName = DAYS_OF_WEEK[dayIndex] as DayName;
      const daySchedule = workerSchedule.schedule?.[dayName];

      if (!daySchedule || !daySchedule.isEnabled) {
        onSelectTime('');
        return;
      }

      const [slotHours, slotMinutes] = selectedTime.split(':').map(Number);
      const [startHours, startMinutes] = daySchedule.start.split(':').map(Number);
      const [endHours, endMinutes] = daySchedule.end.split(':').map(Number);

      const slotTotalMinutes = slotHours * 60 + slotMinutes;
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;

      if (slotTotalMinutes < startTotalMinutes || slotTotalMinutes >= endTotalMinutes) {
        onSelectTime('');
        return;
      }

      const slotStartMinutes = slotTotalMinutes;
      const slotEndMinutes = slotStartMinutes + serviceDuration;

      if (slotEndMinutes > endTotalMinutes) {
        onSelectTime('');
        return;
      }

      // Verificar conflictos con appointments
      const workerNameTrimmed = (workerName || '').trim().toLowerCase();
      for (const appointment of existingAppointments) {
        const appPerformedBy = (appointment.performedBy || '').trim().toLowerCase();
        if (appPerformedBy !== workerNameTrimmed) continue;

        const status = (appointment.status || 'confirmed').toLowerCase();
        if (status === 'cancelled') continue;

        if (!appointment.startTime || !appointment.endTime) continue;

        const appStart = appointment.startTime instanceof Date 
          ? appointment.startTime 
          : new Date(appointment.startTime);
        const appEnd = appointment.endTime instanceof Date 
          ? appointment.endTime 
          : new Date(appointment.endTime);

        const slotDateOnly = new Date(year, month - 1, day);
        const appStartDateOnly = new Date(appStart.getFullYear(), appStart.getMonth(), appStart.getDate());
        
        if (appStartDateOnly.getTime() !== slotDateOnly.getTime()) continue;

        const appStartMinutes = appStart.getHours() * 60 + appStart.getMinutes();
        const appEndMinutes = appEnd.getHours() * 60 + appEnd.getMinutes();

        const hasOverlap = (
          (slotStartMinutes >= appStartMinutes && slotStartMinutes < appEndMinutes) ||
          (slotEndMinutes > appStartMinutes && slotEndMinutes <= appEndMinutes) ||
          (slotStartMinutes <= appStartMinutes && slotEndMinutes >= appEndMinutes) ||
          (appStartMinutes <= slotStartMinutes && appEndMinutes >= slotEndMinutes)
        );

        if (hasOverlap) {
          console.log(`El horario seleccionado ${selectedTime} ya no está disponible, limpiando selección`);
          onSelectTime('');
          return;
        }
      }
    };

    checkAvailability();
  }, [selectedTime, selectedDate, workerSchedule, workerName, existingAppointments, serviceDuration, onSelectTime]);

  // Verificar si un horario está disponible
  const isTimeSlotAvailable = (timeSlot: string): boolean => {
    // Verificaciones básicas
    if (!selectedDate || !workerSchedule || !workerName) {
      console.log(`⏰ ${timeSlot}: No disponible - Faltan datos básicos`, {
        selectedDate,
        hasSchedule: !!workerSchedule,
        workerName
      });
      return false;
    }

    // Parsear la fecha sin problemas de zona horaria
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Ajustar para que Lunes = 0
    const dayName = DAYS_OF_WEEK[dayIndex] as DayName;
    const daySchedule = workerSchedule.schedule?.[dayName];

    // Verificar si el día está habilitado
    if (!daySchedule || !daySchedule.isEnabled) {
      return false;
    }

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

    // Calcular minutos del slot (se usará para verificar que quepa y para conflictos)
    const slotStartMinutes = slotTotalMinutes;
    const slotEndMinutes = slotStartMinutes + serviceDuration;

    // Verificar que el servicio completo quepa en el horario
    if (slotEndMinutes > endTotalMinutes) {
      return false;
    }

    // Verificar conflictos con appointments existentes
    if (existingAppointments.length === 0) {
      return true; // No hay appointments, está disponible
    }

    const workerNameTrimmed = (workerName || '').trim().toLowerCase();
    console.log(`🔍 Verificando ${timeSlot} contra ${existingAppointments.length} appointments para ${workerName}`);

    for (const appointment of existingAppointments) {
      // Verificar que el appointment sea del mismo trabajador
      const appPerformedBy = (appointment.performedBy || '').trim().toLowerCase();
      if (appPerformedBy !== workerNameTrimmed) {
        console.log(`   ⏭️  Appointment no coincide: "${appPerformedBy}" vs "${workerNameTrimmed}"`);
        continue;
      }

      // Ignorar solo appointments cancelados
      const status = (appointment.status || 'confirmed').toLowerCase();
      if (status === 'cancelled') {
        console.log(`   ⏭️  Appointment cancelado, ignorando`);
        continue;
      }

      // Obtener fechas del appointment
      if (!appointment.startTime || !appointment.endTime) {
        console.log(`   ⚠️  Appointment sin fechas válidas`);
        continue;
      }

      const appStart = appointment.startTime instanceof Date 
        ? appointment.startTime 
        : new Date(appointment.startTime);
      const appEnd = appointment.endTime instanceof Date 
        ? appointment.endTime 
        : new Date(appointment.endTime);

      // Verificar que el appointment sea del mismo día
      const slotDateOnly = new Date(year, month - 1, day);
      const appStartDateOnly = new Date(appStart.getFullYear(), appStart.getMonth(), appStart.getDate());
      
      if (appStartDateOnly.getTime() !== slotDateOnly.getTime()) {
        console.log(`   ⏭️  Appointment de otro día`);
        continue;
      }

      // Asegurarse de usar hora local del appointment
      const appStartMinutes = appStart.getHours() * 60 + appStart.getMinutes();
      const appEndMinutes = appEnd.getHours() * 60 + appEnd.getMinutes();

      console.log(`   📊 Comparando: Slot ${timeSlot} (${slotStartMinutes}-${slotEndMinutes}) vs Appointment (${appStartMinutes}-${appEndMinutes})`);

      // Verificar solapamiento - MÁS ESTRICTO
      const hasOverlap = (
        (slotStartMinutes >= appStartMinutes && slotStartMinutes < appEndMinutes) ||
        (slotEndMinutes > appStartMinutes && slotEndMinutes <= appEndMinutes) ||
        (slotStartMinutes <= appStartMinutes && slotEndMinutes >= appEndMinutes) ||
        (appStartMinutes <= slotStartMinutes && appEndMinutes >= slotEndMinutes)
      );

      if (hasOverlap) {
        console.log(`🚫 ${timeSlot} BLOQUEADO - Solapamiento detectado:`, {
          slot: `${timeSlot} (${slotStartMinutes}-${slotEndMinutes} min)`,
          appointment: `${String(appStart.getHours()).padStart(2, '0')}:${String(appStart.getMinutes()).padStart(2, '0')} - ${String(appEnd.getHours()).padStart(2, '0')}:${String(appEnd.getMinutes()).padStart(2, '0')} (${appStartMinutes}-${appEndMinutes} min)`,
          status: appointment.status,
          performedBy: appointment.performedBy
        });
        return false; // BLOQUEADO
      } else {
        console.log(`   ✅ No hay solapamiento`);
      }
    }

    console.log(`✅ ${timeSlot} DISPONIBLE`);
    return true;
  };

  // Memoizar la disponibilidad de cada horario para forzar re-render cuando cambien los appointments
  const timeSlotAvailability = useMemo(() => {
    const availability: Record<string, boolean> = {};
    
    // Inicializar TODOS los horarios primero
    timeSlots.forEach(time => {
      availability[time] = false; // Por defecto no disponible
    });
    
    if (!selectedDate || !workerSchedule || !workerName) {
      console.log('⚠️ [MEMO] Faltan datos básicos, todos los horarios no disponibles');
      return availability;
    }

    // Parsear la fecha
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const dayName = DAYS_OF_WEEK[dayIndex] as DayName;
    const daySchedule = workerSchedule.schedule?.[dayName];

    if (!daySchedule || !daySchedule.isEnabled) {
      console.log('⚠️ [MEMO] Día no habilitado, todos los horarios no disponibles');
      return availability; // Ya están en false
    }

    const [startHours, startMinutes] = daySchedule.start.split(':').map(Number);
    const [endHours, endMinutes] = daySchedule.end.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const workerNameTrimmed = (workerName || '').trim().toLowerCase();

    timeSlots.forEach(time => {
      const [slotHours, slotMinutes] = time.split(':').map(Number);
      const slotTotalMinutes = slotHours * 60 + slotMinutes;
      
      // Verificar rango básico
      if (slotTotalMinutes < startTotalMinutes || slotTotalMinutes >= endTotalMinutes) {
        availability[time] = false;
        return;
      }

      const slotStartMinutes = slotTotalMinutes;
      const slotEndMinutes = slotStartMinutes + serviceDuration;

      if (slotEndMinutes > endTotalMinutes) {
        availability[time] = false;
        return;
      }

      // Verificar conflictos con appointments
      if (existingAppointments.length === 0) {
        availability[time] = true;
        return;
      }

      let hasConflict = false;
      for (const appointment of existingAppointments) {
        const appPerformedBy = (appointment.performedBy || '').trim().toLowerCase();
        if (appPerformedBy !== workerNameTrimmed) continue;

        const status = (appointment.status || 'confirmed').toLowerCase();
        if (status === 'cancelled') continue;

        if (!appointment.startTime || !appointment.endTime) continue;

        const appStart = appointment.startTime instanceof Date 
          ? appointment.startTime 
          : new Date(appointment.startTime);
        const appEnd = appointment.endTime instanceof Date 
          ? appointment.endTime 
          : new Date(appointment.endTime);

        const slotDateOnly = new Date(year, month - 1, day);
        const appStartDateOnly = new Date(appStart.getFullYear(), appStart.getMonth(), appStart.getDate());
        
        if (appStartDateOnly.getTime() !== slotDateOnly.getTime()) continue;

        const appStartMinutes = appStart.getHours() * 60 + appStart.getMinutes();
        const appEndMinutes = appEnd.getHours() * 60 + appEnd.getMinutes();

        const hasOverlap = (
          (slotStartMinutes >= appStartMinutes && slotStartMinutes < appEndMinutes) ||
          (slotEndMinutes > appStartMinutes && slotEndMinutes <= appEndMinutes) ||
          (slotStartMinutes <= appStartMinutes && slotEndMinutes >= appEndMinutes) ||
          (appStartMinutes <= slotStartMinutes && appEndMinutes >= slotEndMinutes)
        );

        if (hasOverlap) {
          hasConflict = true;
          console.log(`🚫 [MEMO] ${time} BLOQUEADO por appointment ${appStart.getHours()}:${String(appStart.getMinutes()).padStart(2, '0')}-${appEnd.getHours()}:${String(appEnd.getMinutes()).padStart(2, '0')}`);
          console.log(`   Detalles: slot(${slotStartMinutes}-${slotEndMinutes}) vs app(${appStartMinutes}-${appEndMinutes})`);
          break;
        }
      }

      availability[time] = !hasConflict;
    });

    // Log detallado de disponibilidad
    const disponibles = Object.entries(availability).filter(([_, v]) => v === true).length;
    const ocupados = Object.entries(availability).filter(([_, v]) => v === false).length;
    
    console.log('📋 [MEMO] Disponibilidad calculada:', {
      refreshKey,
      total: timeSlots.length,
      disponibles,
      ocupados,
      appointments: existingAppointments.length,
      workerName,
      selectedDate
    });
    
    // Log de horarios ocupados específicos
    const ocupadosList = Object.entries(availability)
      .filter(([_, v]) => v === false)
      .map(([time]) => time);
    if (ocupadosList.length > 0) {
      console.log('🚫 [MEMO] Horarios que DEBEN ocultarse:', ocupadosList);
    }
    
    return availability;
  }, [selectedDate, workerSchedule, workerName, existingAppointments, serviceDuration, refreshKey]);

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
            // Generar string de fecha sin problemas de zona horaria
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
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
            {!isLoadingSchedule && workerName && (
              <span className="text-xs text-gray-500 ml-2">
                ({existingAppointments.length} ocupado{existingAppointments.length !== 1 ? 's' : ''})
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3" key={`timeslots-${refreshKey}`}>
            {(() => {
              // Debug completo del objeto de disponibilidad
              console.log('🔍 [DEBUG] timeSlotAvailability:', JSON.stringify(timeSlotAvailability, null, 2));
              console.log('🔍 [DEBUG] existingAppointments:', existingAppointments);
              
              // Filtrar solo horarios disponibles (estricto: solo true)
              const slotsDisponibles = timeSlots.filter(time => {
                const disponible = timeSlotAvailability[time];
                // Verificación múltiple
                const esBoolean = typeof disponible === 'boolean';
                const esTrue = disponible === true;
                const mostrar = esBoolean && esTrue;
                
                console.log(`🔍 [FILTRO] ${time}: disponible=${disponible}, tipo=${typeof disponible}, esBoolean=${esBoolean}, esTrue=${esTrue}, mostrar=${mostrar}`);
                
                if (!mostrar) {
                  console.log(`❌ OCULTANDO ${time}`);
                }
                
                return mostrar;
              });
              
              console.log(`✅ RESULTADO FINAL: Mostrando ${slotsDisponibles.length} de ${timeSlots.length} horarios`);
              console.log(`✅ Horarios a mostrar:`, slotsDisponibles);
              console.log(`❌ Horarios ocultos:`, timeSlots.filter(t => !slotsDisponibles.includes(t)));
              
              if (slotsDisponibles.length === 0) {
                return (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    <p className="text-lg font-semibold mb-2">No hay horarios disponibles</p>
                    <p className="text-sm">Todos los horarios están ocupados para este día y trabajador.</p>
                  </div>
                );
              }
              
              return slotsDisponibles.map((time, index) => {
                // Usar el valor memoizado de disponibilidad
                const isAvailable = timeSlotAvailability[time] ?? false;
                const isSelected = selectedTime === time;

                // Verificación adicional: si está seleccionado pero no disponible, limpiar selección
                if (isSelected && !isAvailable) {
                  console.warn(`⚠️ Horario ${time} estaba seleccionado pero no está disponible, limpiando...`);
                  // Limpiar la selección si no está disponible
                  setTimeout(() => onSelectTime(''), 0);
                }

                // Log para debugging del render
                if (index === 0) {
                  const totalDisponibles = Object.values(timeSlotAvailability).filter(v => v).length;
                  const totalOcupados = timeSlots.length - totalDisponibles;
                  console.log(`🔄 [RENDER] Mostrando ${totalDisponibles} horarios disponibles. Ocultando ${totalOcupados} ocupados. Refresh: ${refreshKey}`);
                }

              return (
                <motion.button
                  key={`available-${time}-${refreshKey}`}
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05, borderColor: '#c9a857' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Verificación doble antes de seleccionar
                    const available = timeSlotAvailability[time] ?? false;
                    console.log(`🖱️ Click en ${time}, disponible: ${available}`);
                    if (available) {
                      onSelectTime(time);
                    } else {
                      console.warn(`⚠️ Intento de seleccionar horario no disponible: ${time}`);
                      alert(`El horario ${time} no está disponible. Por favor, selecciona otro horario.`);
                    }
                  }}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-300 font-bold text-base cursor-pointer
                    ${
                      isSelected
                        ? 'border-[#c9a857] bg-[#c9a857] text-[#1c1b1b] shadow-lg shadow-[#c9a857]/30 ring-2 ring-[#c9a857]/50'
                        : 'border-[#2a2a2a] bg-[#1a1a1a] text-white hover:border-[#c9a857] hover:bg-[#252525]'
                    }
                  `}
                >
                  {time}
                </motion.button>
              );
              });
            })()}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

