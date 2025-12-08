'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import SelectHour from './SelectHour';

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
        console.log('👤 Buscando appointments para trabajador:', {
          workerNameOriginal: workerName,
          workerNameTrimmed: workerNameTrimmed,
          totalAppointments: allAppointments.length
        });

        const appointments = allAppointments.filter(app => {
          const appPerformedBy = (app.performedBy || '').trim().toLowerCase();
          const matches = appPerformedBy === workerNameTrimmed;
          const status = (app.status || 'confirmed').toLowerCase();
          const isNotCancelled = status !== 'cancelled';
          
          if (matches && isNotCancelled) {
            const startDate = app.startTime instanceof Date ? app.startTime : new Date(app.startTime);
            const endDate = app.endTime instanceof Date ? app.endTime : new Date(app.endTime);
            console.log('✅ Appointment MATCH encontrado (OCUPARÁ HORARIO):', {
              id: app.id,
              performedBy: app.performedBy,
              workerName: workerName,
              status: app.status,
              start: `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`,
              end: `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
            });
          } else if (matches && !isNotCancelled) {
            console.log('⏭️ Appointment MATCH pero CANCELADO (ignorando):', {
              performedBy: app.performedBy,
              status: app.status
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

      // Calcular el rango del bloque de 30 minutos
      const blockStartMinutes = slotTotalMinutes;
      const blockEndMinutes = blockStartMinutes + 30;

      // Calcular el rango del servicio completo
      const serviceStartMinutes = slotTotalMinutes;
      const serviceEndMinutes = serviceStartMinutes + serviceDuration;

      if (serviceEndMinutes > endTotalMinutes) {
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

        // Verificar si el bloque de 30 minutos se solapa
        const blockOverlaps = (
          (blockStartMinutes >= appStartMinutes && blockStartMinutes < appEndMinutes) ||
          (blockEndMinutes > appStartMinutes && blockEndMinutes <= appEndMinutes) ||
          (blockStartMinutes <= appStartMinutes && blockEndMinutes >= appEndMinutes) ||
          (appStartMinutes <= blockStartMinutes && appEndMinutes >= blockEndMinutes)
        );

        // Verificar si el servicio completo se solapa
        const serviceOverlaps = (
          (serviceStartMinutes >= appStartMinutes && serviceStartMinutes < appEndMinutes) ||
          (serviceEndMinutes > appStartMinutes && serviceEndMinutes <= appEndMinutes) ||
          (serviceStartMinutes <= appStartMinutes && serviceEndMinutes >= appEndMinutes) ||
          (appStartMinutes <= serviceStartMinutes && appEndMinutes >= serviceEndMinutes)
        );

        if (blockOverlaps || serviceOverlaps) {
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

    // Calcular el rango del bloque de 30 minutos (independiente de la duración del servicio)
    const blockStartMinutes = slotTotalMinutes;
    const blockEndMinutes = blockStartMinutes + 30; // Cada bloque es de 30 minutos

    // Calcular el rango del servicio completo si se selecciona este bloque
    const serviceStartMinutes = slotTotalMinutes;
    const serviceEndMinutes = serviceStartMinutes + serviceDuration;

    // Verificar que el servicio completo quepa en el horario
    if (serviceEndMinutes > endTotalMinutes) {
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

      console.log(`   📊 Comparando: Bloque ${timeSlot} (${blockStartMinutes}-${blockEndMinutes}) y Servicio (${serviceStartMinutes}-${serviceEndMinutes}) vs Appointment (${appStartMinutes}-${appEndMinutes})`);

      // Verificar si el bloque de 30 minutos se solapa con el appointment
      // Esto bloquea el bloque independientemente de la duración del servicio
      const blockOverlaps = (
        (blockStartMinutes >= appStartMinutes && blockStartMinutes < appEndMinutes) ||
        (blockEndMinutes > appStartMinutes && blockEndMinutes <= appEndMinutes) ||
        (blockStartMinutes <= appStartMinutes && blockEndMinutes >= appEndMinutes) ||
        (appStartMinutes <= blockStartMinutes && appEndMinutes >= blockEndMinutes)
      );

      // También verificar si el servicio completo se solapa con el appointment
      // Esto asegura que no se pueda seleccionar un bloque si el servicio completo se solapa
      const serviceOverlaps = (
        (serviceStartMinutes >= appStartMinutes && serviceStartMinutes < appEndMinutes) ||
        (serviceEndMinutes > appStartMinutes && serviceEndMinutes <= appEndMinutes) ||
        (serviceStartMinutes <= appStartMinutes && serviceEndMinutes >= appEndMinutes) ||
        (appStartMinutes <= serviceStartMinutes && appEndMinutes >= serviceEndMinutes)
      );

      if (blockOverlaps || serviceOverlaps) {
        console.log(`🚫 ${timeSlot} BLOQUEADO - Solapamiento detectado:`, {
          bloque: `${timeSlot} bloque (${blockStartMinutes}-${blockEndMinutes} min)`,
          servicio: `${timeSlot} servicio (${serviceStartMinutes}-${serviceEndMinutes} min)`,
          appointment: `${String(appStart.getHours()).padStart(2, '0')}:${String(appStart.getMinutes()).padStart(2, '0')} - ${String(appEnd.getHours()).padStart(2, '0')}:${String(appEnd.getMinutes()).padStart(2, '0')} (${appStartMinutes}-${appEndMinutes} min)`,
          bloqueSolapa: blockOverlaps,
          servicioSolapa: serviceOverlaps,
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

      // Calcular el rango del bloque de 30 minutos (independiente de la duración del servicio)
      const blockStartMinutes = slotTotalMinutes;
      const blockEndMinutes = blockStartMinutes + 30; // Cada bloque es de 30 minutos

      // Calcular el rango del servicio completo si se selecciona este bloque
      const serviceStartMinutes = slotTotalMinutes;
      const serviceEndMinutes = serviceStartMinutes + serviceDuration;

      // Verificar que el servicio completo quepa en el horario del trabajador
      if (serviceEndMinutes > endTotalMinutes) {
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

        // Verificar si el bloque de 30 minutos se solapa con el appointment
        // Esto bloquea el bloque independientemente de la duración del servicio
        const blockOverlaps = (
          (blockStartMinutes >= appStartMinutes && blockStartMinutes < appEndMinutes) ||
          (blockEndMinutes > appStartMinutes && blockEndMinutes <= appEndMinutes) ||
          (blockStartMinutes <= appStartMinutes && blockEndMinutes >= appEndMinutes) ||
          (appStartMinutes <= blockStartMinutes && appEndMinutes >= blockEndMinutes)
        );

        // También verificar si el servicio completo se solapa con el appointment
        // Esto asegura que no se pueda seleccionar un bloque si el servicio completo se solapa
        const serviceOverlaps = (
          (serviceStartMinutes >= appStartMinutes && serviceStartMinutes < appEndMinutes) ||
          (serviceEndMinutes > appStartMinutes && serviceEndMinutes <= appEndMinutes) ||
          (serviceStartMinutes <= appStartMinutes && serviceEndMinutes >= appEndMinutes) ||
          (appStartMinutes <= serviceStartMinutes && appEndMinutes >= serviceEndMinutes)
        );

        if (blockOverlaps || serviceOverlaps) {
          hasConflict = true;
          console.log(`🚫 [MEMO] ${time} BLOQUEADO por appointment ${appStart.getHours()}:${String(appStart.getMinutes()).padStart(2, '0')}-${appEnd.getHours()}:${String(appEnd.getMinutes()).padStart(2, '0')}`);
          console.log(`   Bloque (${blockStartMinutes}-${blockEndMinutes}) solapa: ${blockOverlaps}`);
          console.log(`   Servicio (${serviceStartMinutes}-${serviceEndMinutes}) solapa: ${serviceOverlaps}`);
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
          <SelectHour
            professionalId={selectedStylist}
            professionalName={workerName}
            selectedDate={selectedDate}
            serviceDuration={serviceDuration}
            horaSeleccionada={selectedTime}
            onSelectHour={onSelectTime}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
