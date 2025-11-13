'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface Stylist {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

const stylists: Stylist[] = [
  {
    id: '1',
    name: 'María González',
    specialty: 'Estilista Senior',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    specialty: 'Estilista Master',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    specialty: 'Peinadora Especialista',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    name: 'Laura Sánchez',
    specialty: 'Colorista Certificada',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  },
];

interface StepStylistProps {
  selectedStylist: string | null;
  onSelect: (stylistId: string) => void;
}

export default function StepStylist({ selectedStylist, onSelect }: StepStylistProps) {
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
          Elige tu estilista
        </h2>
        <p className="text-gray-400">
          Selecciona el profesional que prefieras
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stylists.map((stylist, index) => {
          const isSelected = selectedStylist === stylist.id;

          return (
            <motion.button
              key={stylist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(stylist.id)}
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
                  className="absolute top-4 right-4 w-6 h-6 bg-[#c9a857] rounded-full flex items-center justify-center z-10"
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

              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <div
                    className={`
                      w-20 h-20 rounded-full overflow-hidden border-2 transition-colors duration-300
                      ${isSelected ? 'border-[#c9a857]' : 'border-[#151414]'}
                    `}
                  >
                    <img
                      src={stylist.image}
                      alt={stylist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#c9a857] rounded-full flex items-center justify-center"
                    >
                      <User className="w-3 h-3 text-[#1c1b1b]" />
                    </motion.div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3
                    className={`font-semibold text-lg mb-1 ${
                      isSelected ? 'text-[#c9a857]' : 'text-white'
                    }`}
                  >
                    {stylist.name}
                  </h3>
                  <p className="text-sm text-gray-400">{stylist.specialty}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

