'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface Worker {
  id: string;
  name: string;
}

interface StepStylistProps {
  selectedStylist: string | null;
  onSelect: (stylistId: string) => void;
}

export default function StepStylist({ selectedStylist, onSelect }: StepStylistProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }
    // Leer workers dinámicamente desde Firebase
    const unsubscribe = onSnapshot(collection(db, 'workers'), (snapshot) => {
      const workersList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Sin nombre',
      }));
      setWorkers(workersList);
      setIsLoading(false);
    }, (error) => {
      console.error('Error cargando workers:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
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

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Cargando estilistas...</p>
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No hay estilistas disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {workers.map((worker, index) => {
            const isSelected = selectedStylist === worker.id;

          return (
            <motion.button
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(worker.id)}
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
                    <div className="w-full h-full bg-[#c9a857] flex items-center justify-center">
                      <User className="w-10 h-10 text-[#1c1b1b]" />
                    </div>
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
                    {worker.name}
                  </h3>
                  <p className="text-sm text-gray-400">Estilista Profesional</p>
                </div>
              </div>
            </motion.button>
          );
        })}
        </div>
      )}
    </motion.div>
  );
}

