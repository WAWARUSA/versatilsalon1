/**
 * Genera bloques fijos de tiempo de 30 minutos entre 10:00 y 20:00
 * Estos bloques SIEMPRE se muestran independientemente del horario del profesional
 * El sistema debe generar SIEMPRE los mismos bloques desde 10:00 hasta 20:00
 * en intervalos de 30 minutos
 * @returns Array de bloques en formato "HH:MM"
 */
export function generateFixedBlocks(): string[] {
  const blocks: string[] = [];
  
  // Horario fijo: desde 10:00 hasta 20:00 (siempre los mismos bloques)
  const startMinutes = 10 * 60; // 10:00 en minutos
  const endMinutes = 20 * 60; // 20:00 en minutos
  
  // Generar bloques cada 30 minutos
  // IMPORTANTE: Incluir todos los bloques desde 10:00 hasta antes de 20:00
  // Esto genera: 10:00, 10:30, 11:00, ..., 19:00, 19:30 (20 bloques en total)
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const hora = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    blocks.push(hora);
  }
  
  return blocks;
}

