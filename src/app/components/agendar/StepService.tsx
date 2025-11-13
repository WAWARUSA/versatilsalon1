'use client';

import { motion } from 'framer-motion';
import { Scissors, Palette, Sparkles, Hand, Heart, Sparkle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const services: Service[] = [
  {
    id: 'corte',
    name: 'Corte de Cabello',
    icon: Scissors,
    description: 'Cortes modernos y clásicos',
  },
  {
    id: 'coloracion',
    name: 'Coloración',
    icon: Palette,
    description: 'Tintes y mechas profesionales',
  },
  {
    id: 'peinado',
    name: 'Peinado',
    icon: Sparkles,
    description: 'Peinados para ocasiones especiales',
  },
  {
    id: 'manicure',
    name: 'Manicure',
    icon: Hand,
    description: 'Cuidado y decoración de uñas',
  },
  {
    id: 'tratamiento',
    name: 'Tratamiento Capilar',
    icon: Heart,
    description: 'Tratamientos para restaurar y nutrir',
  },
  {
    id: 'premium',
    name: 'Servicios Premium',
    icon: Sparkle,
    description: 'Experiencias personalizadas',
  },
];

interface StepServiceProps {
  selectedService: string | null;
  onSelect: (serviceId: string) => void;
}

export default function StepService({ selectedService, onSelect }: StepServiceProps) {
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
          Selecciona tu servicio
        </h2>
        <p className="text-gray-400">
          Elige el servicio que deseas agendar
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;

          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(service.id)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                bg-[#151414] hover:bg-[#1a1a1a]
                ${
                  isSelected
                    ? 'border-[#c9a857] bg-[#151414] shadow-lg shadow-[#c9a857]/20'
                    : 'border-[#151414] hover:border-[#c9a857]/50'
                }
              `}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-[#c9a857] rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-[#1c1b1b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}

              <div className="flex items-start space-x-4">
                <div
                  className={`
                    p-3 rounded-lg transition-colors duration-300
                    ${isSelected ? 'bg-[#c9a857]' : 'bg-[#1c1b1b]'}
                  `}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isSelected ? 'text-[#1c1b1b]' : 'text-[#c9a857]'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 ${
                      isSelected ? 'text-[#c9a857]' : 'text-white'
                    }`}
                  >
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-400">{service.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

