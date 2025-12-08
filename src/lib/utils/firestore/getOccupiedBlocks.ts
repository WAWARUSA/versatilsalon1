import { db } from '../../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

/**
 * Obtiene los bloques de 30 minutos ocupados de un profesional en una fecha específica
 * Calcula cuántos bloques debe ocupar cada reserva según su duración REAL
 * @param professionalName - Nombre del profesional (performedBy)
 * @param selectedDate - Fecha en formato "YYYY-MM-DD"
 * @returns Array de horas ocupadas en formato "HH:MM"
 */
export async function getOccupiedBlocks(
  professionalName: string,
  selectedDate: string
): Promise<string[]> {
  if (!db) {
    console.error('Firebase no está inicializado');
    return [];
  }

  try {
    // Parsear la fecha sin problemas de zona horaria
    const [year, month, day] = selectedDate.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    // Consultar appointments del día seleccionado
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('startTime', '>=', Timestamp.fromDate(startOfDay)),
      where('startTime', '<=', Timestamp.fromDate(endOfDay))
    );

    const snapshot = await getDocs(appointmentsQuery);
    const bloquesOcupadosSet = new Set<string>(); // Usar Set para evitar duplicados

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      
      // Filtrar por performedBy
      const performedBy = (data.performedBy || '').trim();
      if (performedBy.toLowerCase() !== professionalName.trim().toLowerCase()) {
        return;
      }

      // Filtrar por status == "confirmed"
      const status = (data.status || '').toLowerCase();
      if (status !== 'confirmed') {
        return;
      }

      // Obtener la hora de inicio del appointment
      let startTime: Date | null = null;
      let duration: number | null = null;

      // PRIORIDAD 1: Si hay endTime, calcular duración desde startTime y endTime (más preciso)
      if (data.startTime && data.endTime) {
        try {
          const parsedStartTime = data.startTime.toDate();
          const endTime = data.endTime.toDate();
          startTime = parsedStartTime;
          const diffMs = endTime.getTime() - parsedStartTime.getTime();
          duration = Math.max(0, Math.round(diffMs / 60000)); // Convertir a minutos, asegurar no negativo
        } catch (error) {
          console.warn('Error parseando startTime/endTime:', error);
        }
      }

      // PRIORIDAD 2: Si no se calculó duración o no hay startTime, buscar en serviceIds[0]
      if (duration === null || !startTime) {
        if (data.serviceIds && Array.isArray(data.serviceIds) && data.serviceIds.length > 0) {
          const firstService = data.serviceIds[0];
          if (firstService) {
            // Si no hay startTime, intentar obtenerlo de serviceIds
            if (!startTime && firstService.startTime) {
              try {
                if (firstService.startTime.toDate) {
                  startTime = firstService.startTime.toDate();
                } else if (firstService.startTime instanceof Date) {
                  startTime = firstService.startTime;
                }
              } catch (error) {
                console.warn('Error parseando startTime de serviceIds:', error);
              }
            }
            
            // Obtener duración del servicio
            if (duration === null && firstService.duration !== undefined && firstService.duration !== null) {
              duration = typeof firstService.duration === 'number' ? firstService.duration : null;
            }
          }
        }
      }

      // PRIORIDAD 3: Si no se encontró startTime, intentar desde el documento principal
      if (!startTime && data.startTime) {
        try {
          startTime = data.startTime.toDate();
        } catch (error) {
          console.warn('Error parseando startTime del documento:', error);
        }
      }

      // PRIORIDAD 4: Si no se calculó duración, buscar en el documento principal
      if (duration === null && data.duration !== undefined && data.duration !== null) {
        duration = typeof data.duration === 'number' ? data.duration : null;
      }

      // Si no se encontró duración, usar 60 minutos por defecto
      if (duration === null || duration <= 0) {
        duration = 60;
      }

      if (startTime) {
        // Verificar que sea del mismo día
        const appointmentDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
        const selectedDateObj = new Date(year, month - 1, day);
        
        if (appointmentDate.getTime() === selectedDateObj.getTime()) {
          // Calcular cuántos bloques de 30 minutos ocupa esta reserva
          // Debe calcularse como: nBloques = ceil(duration / 30min)
          // Ejemplo: Si dura 90 minutos, debe bloquear 3 bloques (12:00, 12:30, 13:00)
          const bloquesNecesarios = Math.ceil(duration / 30);
          
          // Generar todos los bloques ocupados por esta reserva
          // El bloque en el que comienza la reserva + todos los bloques siguientes requeridos por la duración total
          for (let i = 0; i < bloquesNecesarios; i++) {
            const bloqueTime = new Date(startTime);
            bloqueTime.setMinutes(bloqueTime.getMinutes() + (i * 30));
            
            // Extraer la hora en formato "HH:MM"
            const hours = String(bloqueTime.getHours()).padStart(2, '0');
            const minutes = String(bloqueTime.getMinutes()).padStart(2, '0');
            const hora = `${hours}:${minutes}`;
            
            // Agregar al Set (evita duplicados automáticamente)
            bloquesOcupadosSet.add(hora);
          }
          
          const startHourStr = `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`;
          console.log(`📋 Reserva: ${startHourStr}, duración: ${duration}min, bloques ocupados: ${bloquesNecesarios}`);
        }
      }
    });

    const bloquesOcupados = Array.from(bloquesOcupadosSet).sort();
    console.log(`📋 Total bloques ocupados para ${professionalName} el ${selectedDate}:`, bloquesOcupados.length, bloquesOcupados);
    return bloquesOcupados;
  } catch (error) {
    console.error('Error obteniendo bloques ocupados:', error);
    return [];
  }
}

