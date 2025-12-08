'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { getWorkerOccupiedHours } from '../../../lib/utils/getWorkerOccupiedHours';

interface HourSlot {
  hora: string;
  disponible: boolean;
}

interface SelectHourProps {
  profesionalSeleccionado: string | null;
  fechaSeleccionada: string | null; // Formato "YYYY-MM-DD"
  horarioBase: string[]; // Array de horas disponibles ["09:00", "10:00", ...]
  horaSeleccionada: string | null;
  onSelectHour: (hora: string) => void;
}

export default function SelectHour({
  profesionalSeleccionado,
  fechaSeleccionada,
  horarioBase,
  horaSeleccionada,
  onSelectHour,
}: SelectHourProps) {
  const [horas, setHoras] = useState<HourSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadHours = async () => {
      if (!profesionalSeleccionado || !fechaSeleccionada) {
        setHoras([]);
        return;
      }

      setIsLoading(true);
      try {
        // Obtener horas ocupadas desde Firebase
        const horasOcupadas = await getWorkerOccupiedHours(
          profesionalSeleccionado,
          fechaSeleccionada
        );

        // Construir array de horas con estado disponible/ocupada
        const horasConEstado: HourSlot[] = horarioBase.map((hora) => ({
          hora,
          disponible: !horasOcupadas.includes(hora),
        }));

        setHoras(horasConEstado);
      } catch (error) {
        console.error('Error cargando horas:', error);
        // En caso de error, marcar todas como disponibles
        setHoras(
          horarioBase.map((hora) => ({
            hora,
            disponible: true,
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadHours();
  }, [profesionalSeleccionado, fechaSeleccionada, horarioBase]);

  const handleHourClick = (hora: string, disponible: boolean) => {
    if (!disponible) {
      alert(`⚠️ El horario ${hora} está ocupado. Por favor, selecciona otro horario disponible.`);
      console.error(`❌ Intento de seleccionar horario ocupado ${hora} - BLOQUEADO`);
      return;
    }

    console.log(`✅ Seleccionando horario disponible: ${hora}`);
    onSelectHour(hora);
  };

  if (!profesionalSeleccionado || !fechaSeleccionada) {
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

  const horasDisponibles = horas.filter((h) => h.disponible);
  const horasOcupadas = horas.filter((h) => !h.disponible);

  if (horasDisponibles.length === 0 && horas.length > 0) {
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
        {horasOcupadas.length > 0 && (
          <span className="text-xs text-gray-500 ml-2">
            ({horasOcupadas.length} ocupado{horasOcupadas.length !== 1 ? 's' : ''})
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {horas.map((slot, index) => {
          const isSelected = horaSeleccionada === slot.hora;
          const isAvailable = slot.disponible;

          if (!isAvailable) {
            return (
              <div
                key={slot.hora}
                className="p-3 rounded-lg border-2 border-[#0a0a0a] bg-gray-400 text-white cursor-not-allowed opacity-60 select-none relative"
                title={`Horario ocupado - ${profesionalSeleccionado} no está disponible a las ${slot.hora}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleHourClick(slot.hora, false);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleHourClick(slot.hora, false);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleHourClick(slot.hora, false);
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
                {slot.hora}
              </div>
            );
          }

          return (
            <motion.button
              key={slot.hora}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.05, borderColor: '#c9a857' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleHourClick(slot.hora, true)}
              className={`
                p-3 rounded-lg border-2 transition-all duration-300 font-bold text-base cursor-pointer
                ${
                  isSelected
                    ? 'border-[#c9a857] bg-[#c9a857] text-[#1c1b1b] shadow-lg shadow-[#c9a857]/30 ring-2 ring-[#c9a857]/50'
                    : 'bg-white text-black hover:bg-gray-200 border-gray-300'
                }
              `}
              title={isSelected ? 'Horario seleccionado' : 'Seleccionar este horario'}
            >
              {slot.hora}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

