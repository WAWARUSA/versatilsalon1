/**
 * Genera bloques de tiempo de 30 minutos entre startHour y endHour
 * @param startHour - Hora de inicio en formato "HH:MM"
 * @param endHour - Hora de fin en formato "HH:MM"
 * @returns Array de bloques en formato "HH:MM"
 */
export function generateTimeBlocks(startHour: string, endHour: string): string[] {
  const blocks: string[] = [];
  
  // Validar formato de entrada
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(startHour) || !timeRegex.test(endHour)) {
    console.error('Formato de hora inválido:', { startHour, endHour });
    return [];
  }
  
  // Parsear horas de inicio y fin
  const [startH, startM] = startHour.split(':').map(Number);
  const [endH, endM] = endHour.split(':').map(Number);
  
  // Validar que los valores sean válidos
  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
    console.error('Error parseando horas:', { startHour, endHour });
    return [];
  }
  
  // Validar que startHour < endHour
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  if (startMinutes >= endMinutes) {
    console.error('La hora de inicio debe ser menor que la hora de fin:', { startHour, endHour });
    return [];
  }
  
  // Generar bloques cada 30 minutos
  // IMPORTANTE: No incluir el bloque final (endHour), solo hasta antes de él
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const hora = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    blocks.push(hora);
  }
  
  return blocks;
}

