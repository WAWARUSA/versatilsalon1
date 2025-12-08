'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { getProfessionalSchedule } from '../../../lib/utils/firestore/getProfessionalSchedule';
import { getOccupiedBlocks } from '../../../lib/utils/firestore/getOccupiedBlocks';
import { generateFixedBlocks } from '../../../lib/utils/time/generateFixedBlocks';

interface HourBlock {
  hora: string; // Formato "HH:MM"
  disponible: boolean;
  bloqueadoPorHorario: boolean; // Bloqueado porque está fuera del horario laboral
  bloqueadoPorReserva: boolean; // Bloqueado porque hay una reserva existente
}

interface SelectHourProps {
  professionalId: string | null; // ID del profesional en Firebase
  professionalName: string | null; // Nombre del profesional (para buscar appointments)
  selectedDate: string | null; // Formato "YYYY-MM-DD"
  serviceDuration: number; // Duración del servicio en minutos
  horaSeleccionada: string | null;
  onSelectHour: (hora: string) => void;
}

/**
 * Verifica si un bloque de tiempo está dentro del horario laboral del profesional
 * El bloque está dentro del horario si es >= startHour y < endHour
 * Los bloques fuera del horario laboral SIEMPRE deben estar bloqueados
 */
function isBlockInWorkingHours(blockHour: string, startHour: string, endHour: string): boolean {
  const [blockH, blockM] = blockHour.split(':').map(Number);
  const [startH, startM] = startHour.split(':').map(Number);
  const [endH, endM] = endHour.split(':').map(Number);
  
  const blockMinutes = blockH * 60 + blockM;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  // El bloque está dentro del horario si es >= startHour y < endHour
  // Si el bloque está fuera del horario laboral, debe aparecer como bloqueado
  return blockMinutes >= startMinutes && blockMinutes < endMinutes;
}

export default function SelectHour({
  professionalId,
  professionalName,
  selectedDate,
  serviceDuration,
  horaSeleccionada,
  onSelectHour,
}: SelectHourProps) {
  const [bloques, setBloques] = useState<HourBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBlocks = async () => {
      if (!professionalId || !professionalName || !selectedDate) {
        setBloques([]);
        return;
      }

      setIsLoading(true);
      try {
        console.log('🕐 [SelectHour] Iniciando carga de bloques:', {
          professionalId,
          professionalName,
          selectedDate
        });
        
        // 1. Generar bloques fijos entre 10:00 y 20:00 (siempre los mismos)
        const bloquesFijos = generateFixedBlocks();
        console.log(`📋 [SelectHour] Bloques fijos generados: ${bloquesFijos.length}`, bloquesFijos);
        
        // 2. Obtener horario laboral del profesional
        const schedule = await getProfessionalSchedule(professionalId);
        console.log('📅 [SelectHour] Horario obtenido:', schedule);
        
        // 3. Obtener bloques ocupados por reservas existentes
        const bloquesOcupados = await getOccupiedBlocks(professionalName, selectedDate);
        console.log(`🚫 [SelectHour] Bloques ocupados: ${bloquesOcupados.length}`, bloquesOcupados);

        // 4. Construir array de bloques con estado completo
        // El estado final de cada bloque debe ser:
        // - Bloqueado por horario → si está fuera del horario laboral del profesional
        // - Bloqueado por reserva existente → si está dentro de un tramo ocupado según duración real
        // - Disponible → solo si está dentro del horario laboral y no está ocupado por reservas
        const bloquesConEstado: HourBlock[] = bloquesFijos.map((hora) => {
          // Si no hay horario del profesional, usar horario por defecto amplio
          // para que al menos algunos bloques estén disponibles
          if (!schedule) {
            console.warn(`⚠️ [SelectHour] No hay horario para ${professionalId}, usando horario por defecto`);
            // Usar horario por defecto 10:00-20:00 para que todos los bloques estén disponibles
            const dentroHorario = isBlockInWorkingHours(hora, '10:00', '20:00');
            const ocupadoPorReserva = bloquesOcupados.includes(hora);
            const disponible = dentroHorario && !ocupadoPorReserva;
            
            return {
              hora,
              disponible,
              bloqueadoPorHorario: !dentroHorario,
              bloqueadoPorReserva: ocupadoPorReserva,
            };
          }

          // Verificar si está dentro del horario laboral
          const dentroHorario = isBlockInWorkingHours(hora, schedule.startHour, schedule.endHour);
          
          // Verificar si está ocupado por una reserva existente
          const ocupadoPorReserva = bloquesOcupados.includes(hora);
          
          // Un bloque está disponible solo si:
          // - Está dentro del horario laboral Y
          // - No está ocupado por una reserva
          // Los bloques fuera del horario laboral SIEMPRE deben estar bloqueados,
          // incluso si no hay reservas
          const disponible = dentroHorario && !ocupadoPorReserva;
          
          return {
            hora,
            disponible,
            bloqueadoPorHorario: !dentroHorario,
            bloqueadoPorReserva: ocupadoPorReserva,
          };
        });

        const disponibles = bloquesConEstado.filter(b => b.disponible).length;
        console.log(`✅ [SelectHour] Bloques procesados: ${bloquesConEstado.length} total, ${disponibles} disponibles`);
        
        setBloques(bloquesConEstado);
      } catch (error) {
        console.error('Error cargando bloques:', error);
        // En caso de error, marcar todos como bloqueados
        const bloquesFijos = generateFixedBlocks();
        setBloques(
          bloquesFijos.map((hora) => ({
            hora,
            disponible: false,
            bloqueadoPorHorario: true,
            bloqueadoPorReserva: false,
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBlocks();
  }, [professionalId, professionalName, selectedDate]);

  // Verificar si el bloque seleccionado sigue disponible cuando cambian los bloques
  useEffect(() => {
    if (horaSeleccionada && bloques.length > 0) {
      const bloqueSeleccionado = bloques.find(b => b.hora === horaSeleccionada);
      if (bloqueSeleccionado && !bloqueSeleccionado.disponible) {
        // Si el bloque seleccionado ya no está disponible, limpiar selección
        onSelectHour('');
      }
    }
  }, [bloques, horaSeleccionada, onSelectHour]);

  const handleBlockClick = (block: HourBlock) => {
    if (!block.disponible) {
      let mensaje = '';
      if (block.bloqueadoPorHorario) {
        mensaje = `⚠️ El horario ${block.hora} está fuera del horario laboral del profesional.`;
      } else if (block.bloqueadoPorReserva) {
        mensaje = `⚠️ El horario ${block.hora} está ocupado. Por favor, selecciona otro horario disponible.`;
      } else {
        mensaje = `⚠️ El horario ${block.hora} no está disponible.`;
      }
      alert(mensaje);
      console.error(`❌ Intento de seleccionar bloque bloqueado ${block.hora} - BLOQUEADO`, {
        bloqueadoPorHorario: block.bloqueadoPorHorario,
        bloqueadoPorReserva: block.bloqueadoPorReserva,
      });
      return;
    }

    console.log(`✅ Seleccionando bloque disponible: ${block.hora}`);
    onSelectHour(block.hora);
  };

  if (!professionalId || !professionalName || !selectedDate) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Primero selecciona un profesional y una fecha</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Cargando disponibilidad de horarios...</p>
      </div>
    );
  }

  const bloquesDisponibles = bloques.filter((b) => b.disponible);
  const bloquesOcupados = bloques.filter((b) => !b.disponible);

  if (bloquesDisponibles.length === 0 && bloques.length > 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-lg font-semibold mb-2">No hay horarios disponibles</p>
        <p className="text-sm">Todos los horarios están ocupados para este día y profesional.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-[#c9a857]" />
        <h3 className="text-lg font-semibold text-white">Hora</h3>
        {bloquesOcupados.length > 0 && (
          <span className="text-xs text-gray-500 ml-2">
            ({bloquesOcupados.length} ocupado{bloquesOcupados.length !== 1 ? 's' : ''})
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {bloques.map((block, index) => {
          const isSelected = horaSeleccionada === block.hora;
          const isAvailable = block.disponible;

          // Determinar el título según el tipo de bloqueo
          let title = '';
          if (block.bloqueadoPorHorario) {
            title = `Fuera del horario laboral - ${professionalName} no trabaja a las ${block.hora}`;
          } else if (block.bloqueadoPorReserva) {
            title = `Horario ocupado - ${professionalName} no está disponible a las ${block.hora}`;
          } else if (isSelected) {
            title = 'Horario seleccionado';
          } else {
            title = 'Seleccionar este horario';
          }

          if (!isAvailable) {
            return (
              <div
                key={block.hora}
                className="p-4 rounded-lg border-2 border-[#151414] bg-[#0a0a0a] text-gray-600 cursor-not-allowed opacity-40 select-none relative"
                title={title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBlockClick(block);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBlockClick(block);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBlockClick(block);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">{block.hora}</div>
                </div>
              </div>
            );
          }

          return (
            <motion.button
              key={block.hora}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBlockClick(block)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-300
                ${
                  isSelected
                    ? 'border-[#c9a857] bg-[#c9a857] text-[#1c1b1b] shadow-lg shadow-[#c9a857]/20'
                    : 'border-[#151414] bg-[#151414] text-white hover:border-[#c9a857]/50'
                }
              `}
              title={title}
            >
              <div className="text-center">
                <div className="text-lg font-bold">{block.hora}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
