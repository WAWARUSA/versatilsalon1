'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';

interface Worker {
  id: string;
  name: string;
  isAvailable?: boolean; // Indica si el worker puede realizar el servicio seleccionado
}

interface StepStylistProps {
  selectedStylist: string | null;
  onSelect: (stylistId: string) => void;
  selectedService: string | null; // ID del servicio seleccionado
}

export default function StepStylist({ selectedStylist, onSelect, selectedService }: StepStylistProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableWorkerIds, setAvailableWorkerIds] = useState<string[]>([]);

  // Cargar los workerIds del servicio seleccionado
  useEffect(() => {
    if (!db || !selectedService) {
      setAvailableWorkerIds([]);
      return;
    }

    const loadServiceWorkers = async () => {
      try {
        const serviceRef = doc(db, 'services', selectedService);
        const serviceSnap = await getDoc(serviceRef);
        
        if (serviceSnap.exists()) {
          const serviceData = serviceSnap.data();
          const workerIds = serviceData.workerIds || [];
          setAvailableWorkerIds(Array.isArray(workerIds) ? workerIds : []);
        } else {
          // Si no existe el servicio, permitir todos los workers
          setAvailableWorkerIds([]);
        }
      } catch (error) {
        console.error('Error cargando workers del servicio:', error);
        setAvailableWorkerIds([]);
      }
    };

    loadServiceWorkers();
  }, [selectedService]);

  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }
    // Leer workers dinámicamente desde Firebase
    const unsubscribe = onSnapshot(collection(db, 'workers'), (snapshot) => {
      const workersList = snapshot.docs.map(doc => {
        const id = doc.id;
        // Si no hay workerIds definidos (servicio sin restricciones), todos están disponibles
        const isAvailable = availableWorkerIds.length === 0 || availableWorkerIds.includes(id);
        
        return {
          id,
          name: doc.data().name || 'Sin nombre',
          isAvailable,
        };
      });
      setWorkers(workersList);
      setIsLoading(false);
    }, (error) => {
      console.error('Error cargando workers:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [availableWorkerIds]);
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
            const isAvailable = worker.isAvailable !== false;

          return (
            <motion.button
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={isAvailable ? { scale: 1.02 } : {}}
              whileTap={isAvailable ? { scale: 0.98 } : {}}
              onClick={() => isAvailable && onSelect(worker.id)}
              disabled={!isAvailable}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                ${!isAvailable 
                  ? 'bg-[#0f0e0e] border-[#151414] opacity-50 cursor-not-allowed' 
                  : 'bg-[#151414] hover:bg-[#1a1a1a]'
                }
                ${
                  isSelected && isAvailable
                    ? 'border-[#c9a857] bg-[#151414] shadow-lg shadow-[#c9a857]/20'
                    : isAvailable 
                      ? 'border-[#151414] hover:border-[#c9a857]/50'
                      : 'border-[#151414]'
                }
              `}
            >
              {!isAvailable && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-[#151414] rounded-full flex items-center justify-center z-10 border-2 border-gray-600"
                >
                  <Lock className="w-4 h-4 text-gray-500" />
                </motion.div>
              )}

              {isSelected && isAvailable && (
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
                      ${isSelected && isAvailable ? 'border-[#c9a857]' : 'border-[#151414]'}
                      ${!isAvailable ? 'grayscale' : ''}
                    `}
                  >
                    <div className={`w-full h-full flex items-center justify-center ${isAvailable ? 'bg-[#c9a857]' : 'bg-gray-700'}`}>
                      <User className={`w-10 h-10 ${isAvailable ? 'text-[#1c1b1b]' : 'text-gray-500'}`} />
                    </div>
                  </div>
                  {isSelected && isAvailable && (
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
                      isSelected && isAvailable ? 'text-[#c9a857]' : isAvailable ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {worker.name}
                  </h3>
                  <p className={`text-sm ${isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isAvailable ? 'Estilista Profesional' : 'No realiza este servicio'}
                  </p>
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

