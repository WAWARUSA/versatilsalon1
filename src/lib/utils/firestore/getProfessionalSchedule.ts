import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ProfessionalSchedule {
  startHour: string; // Formato "HH:MM"
  endHour: string; // Formato "HH:MM"
}

/**
 * Valida y formatea una hora al formato "HH:MM"
 */
function formatHour(hour: unknown): string | null {
  if (!hour) return null;
  
  const hourStr = String(hour).trim();
  
  // Si ya está en formato "HH:MM", validar y retornar
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (timeRegex.test(hourStr)) {
    // Asegurar formato con dos dígitos en horas
    const [h, m] = hourStr.split(':');
    return `${String(Number(h)).padStart(2, '0')}:${m}`;
  }
  
  // Si es un número (minutos desde medianoche), convertir
  if (!isNaN(Number(hourStr))) {
    const totalMinutes = Number(hourStr);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
  }
  
  return null;
}

/**
 * Obtiene el horario laboral de un profesional desde Firebase
 * Busca en /professionals/{id} o /workers/{id}
 * @param professionalId - ID del profesional en Firebase
 * @returns Objeto con startHour y endHour formateados, o null si no se encuentra
 */
export async function getProfessionalSchedule(
  professionalId: string
): Promise<ProfessionalSchedule | null> {
  if (!db) {
    console.error('Firebase no está inicializado');
    return null;
  }

  try {
    console.log(`🔍 Buscando horario para profesional ID: ${professionalId}`);
    
    // Intentar buscar en /professionals/{id}
    const professionalRef = doc(db, 'professionals', professionalId);
    const professionalSnap = await getDoc(professionalRef);
    
    if (professionalSnap.exists()) {
      const data = professionalSnap.data();
      console.log(`📋 Datos encontrados en /professionals/${professionalId}:`, data);
      
      const startHour = formatHour(data.startHour);
      const endHour = formatHour(data.endHour);
      
      if (startHour && endHour) {
        console.log(`✅ Horario encontrado en /professionals/${professionalId}:`, { startHour, endHour });
        return { startHour, endHour };
      } else {
        console.warn(`⚠️ Campos startHour/endHour no válidos en /professionals/${professionalId}:`, {
          startHour: data.startHour,
          endHour: data.endHour,
          startHourFormatted: startHour,
          endHourFormatted: endHour
        });
      }
    } else {
      console.log(`ℹ️ No se encontró documento en /professionals/${professionalId}`);
    }

    // Si no se encuentra en professionals, buscar en /workers/{id}
    const workerRef = doc(db, 'workers', professionalId);
    const workerSnap = await getDoc(workerRef);
    
    if (workerSnap.exists()) {
      const data = workerSnap.data();
      console.log(`📋 Datos encontrados en /workers/${professionalId}:`, data);
      
      const startHour = formatHour(data.startHour);
      const endHour = formatHour(data.endHour);
      
      if (startHour && endHour) {
        console.log(`✅ Horario encontrado en /workers/${professionalId}:`, { startHour, endHour });
        return { startHour, endHour };
      } else {
        console.warn(`⚠️ Campos startHour/endHour no válidos en /workers/${professionalId}:`, {
          startHour: data.startHour,
          endHour: data.endHour,
          startHourFormatted: startHour,
          endHourFormatted: endHour
        });
        
        // Intentar buscar campos alternativos (por si están en otro formato)
        const altStartHour = formatHour(data.startTime || data.start || data.horaInicio);
        const altEndHour = formatHour(data.endTime || data.end || data.horaFin);
        
        if (altStartHour && altEndHour) {
          console.log(`✅ Horario encontrado en campos alternativos de /workers/${professionalId}:`, {
            startHour: altStartHour,
            endHour: altEndHour
          });
          return { startHour: altStartHour, endHour: altEndHour };
        }
      }
    } else {
      console.log(`ℹ️ No se encontró documento en /workers/${professionalId}`);
    }

    // Si no se encuentra horario, usar horario por defecto amplio (10:00-20:00)
    // para que al menos algunos bloques estén disponibles
    console.warn(`⚠️ No se encontró horario para profesional ${professionalId}, usando horario por defecto 10:00-20:00`);
    return { startHour: '10:00', endHour: '20:00' };
  } catch (error) {
    console.error('❌ Error obteniendo horario del profesional:', error);
    // Usar horario por defecto en caso de error para que haya bloques disponibles
    console.log('ℹ️ Usando horario por defecto 10:00-20:00 debido a error');
    return { startHour: '10:00', endHour: '20:00' };
  }
}

