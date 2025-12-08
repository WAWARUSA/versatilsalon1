import { db } from '../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

/**
 * Obtiene las horas ocupadas de un profesional en una fecha específica
 * @param profesionalSeleccionado - Nombre del profesional (performedBy)
 * @param fechaSeleccionada - Fecha en formato "YYYY-MM-DD"
 * @returns Array de horas ocupadas en formato "HH:MM"
 */
export async function getWorkerOccupiedHours(
  profesionalSeleccionado: string,
  fechaSeleccionada: string
): Promise<string[]> {
  if (!db) {
    console.error('Firebase no está inicializado');
    return [];
  }

  try {
    // Parsear la fecha sin problemas de zona horaria
    const [year, month, day] = fechaSeleccionada.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    // Consultar appointments del día seleccionado
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('startTime', '>=', Timestamp.fromDate(startOfDay)),
      where('startTime', '<=', Timestamp.fromDate(endOfDay))
    );

    const snapshot = await getDocs(appointmentsQuery);
    const horasOcupadas: string[] = [];

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      
      // Filtrar por performedBy
      const performedBy = (data.performedBy || '').trim();
      if (performedBy.toLowerCase() !== profesionalSeleccionado.trim().toLowerCase()) {
        return;
      }

      // Filtrar por status == "confirmed"
      const status = (data.status || '').toLowerCase();
      if (status !== 'confirmed') {
        return;
      }

      // Obtener la hora del appointment
      let startTime: Date | null = null;

      // Caso 1: startTime está directamente en el documento (estructura actual)
      if (data.startTime) {
        startTime = data.startTime.toDate();
      }
      // Caso 2: startTime está dentro de serviceIds[0] (estructura alternativa)
      else if (data.serviceIds && Array.isArray(data.serviceIds) && data.serviceIds.length > 0) {
        const firstService = data.serviceIds[0];
        if (firstService && firstService.startTime) {
          // Si es un Timestamp de Firebase
          if (firstService.startTime.toDate) {
            startTime = firstService.startTime.toDate();
          } else if (firstService.startTime instanceof Date) {
            startTime = firstService.startTime;
          }
        }
      }

      if (startTime) {
        // Verificar que sea del mismo día
        const appointmentDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
        const selectedDate = new Date(year, month - 1, day);
        
        if (appointmentDate.getTime() === selectedDate.getTime()) {
          // Extraer la hora en formato "HH:MM"
          const hours = String(startTime.getHours()).padStart(2, '0');
          const minutes = String(startTime.getMinutes()).padStart(2, '0');
          const hora = `${hours}:${minutes}`;
          
          // Agregar solo si no está ya en el array
          if (!horasOcupadas.includes(hora)) {
            horasOcupadas.push(hora);
          }
        }
      }
    });

    console.log(`📋 Horas ocupadas para ${profesionalSeleccionado} el ${fechaSeleccionada}:`, horasOcupadas);
    return horasOcupadas.sort(); // Ordenar las horas
  } catch (error) {
    console.error('Error obteniendo horas ocupadas:', error);
    return [];
  }
}

