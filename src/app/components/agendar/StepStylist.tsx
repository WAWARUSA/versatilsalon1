'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

interface Worker {
  id: string;
  name: string;
  services?: string[]; // Array de IDs o nombres de servicios que puede realizar
}

interface StepStylistProps {
  selectedStylist: string | null;
  selectedService: string | null; // ID del servicio seleccionado
  onSelect: (stylistId: string) => void;
}

// Mapeo de IDs de servicios a nombres (para compatibilidad)
const serviceNameMap: Record<string, string> = {
  'corte': 'Corte de Cabello',
  'coloracion': 'Coloración',
  'peinado': 'Peinado',
  'manicure': 'Manicure',
  'tratamiento': 'Tratamiento Capilar',
  'premium': 'Servicios Premium',
};

export default function StepStylist({ selectedStylist, selectedService, onSelect }: StepStylistProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceName, setServiceName] = useState<string | null>(null);
  const [serviceWorkerIds, setServiceWorkerIds] = useState<string[]>([]);

  // Cargar el servicio desde Firebase y obtener los workerIds
  useEffect(() => {
    const loadService = async () => {
      if (!selectedService || !db) {
        setServiceName(null);
        setServiceWorkerIds([]);
        return;
      }

      try {
        // Intentar buscar por ID directo primero
        const serviceRef = doc(db, 'services', selectedService);
        const serviceSnap = await getDoc(serviceRef);
        
        if (serviceSnap.exists()) {
          const serviceData = serviceSnap.data();
          const serviceNameFound = serviceData.name || null;
          setServiceName(serviceNameFound);
          
          // Obtener workerIds del servicio encontrado
          const workerIds = serviceData.workerIds || [];
          const allWorkerIds: string[] = [];
          
          // Agregar los workerIds del servicio encontrado
          if (Array.isArray(workerIds)) {
            workerIds.forEach(id => {
              const cleanedId = String(id).trim();
              if (cleanedId.length > 0 && !allWorkerIds.includes(cleanedId)) {
                allWorkerIds.push(cleanedId);
              }
            });
          }
          
          // Si el servicio tiene nombre, buscar otros servicios con el mismo nombre (variaciones)
          if (serviceNameFound) {
            const servicesRef = collection(db, 'services');
            const servicesSnapshot = await getDocs(query(servicesRef, where('name', '==', serviceNameFound)));
            servicesSnapshot.docs.forEach(serviceDoc => {
              // Evitar duplicar el servicio que ya procesamos
              if (serviceDoc.id !== selectedService) {
                const variationData = serviceDoc.data();
                const variationWorkerIds = variationData.workerIds || [];
                if (Array.isArray(variationWorkerIds)) {
                  variationWorkerIds.forEach(id => {
                    const cleanedId = String(id).trim();
                    if (cleanedId.length > 0 && !allWorkerIds.includes(cleanedId)) {
                      allWorkerIds.push(cleanedId);
                    }
                  });
                }
              }
            });
            console.log(`Servicio encontrado por ID. Total de servicios con nombre "${serviceNameFound}": ${servicesSnapshot.docs.length}`);
          }
          
          console.log('Todos los workerIds combinados (por ID + variaciones):', allWorkerIds);
          setServiceWorkerIds(allWorkerIds);
        } else {
          // Si no se encuentra por ID, buscar por nombre usando el mapeo
          const mappedName = serviceNameMap[selectedService];
          setServiceName(mappedName || selectedService);
          setServiceWorkerIds([]);
          
          // Buscar TODOS los servicios con ese nombre (puede haber variaciones)
          if (mappedName) {
            const servicesRef = collection(db, 'services');
            const servicesSnapshot = await getDocs(query(servicesRef, where('name', '==', mappedName)));
            if (!servicesSnapshot.empty) {
              // Combinar todos los workerIds de todos los servicios con ese nombre
              const allWorkerIds: string[] = [];
              servicesSnapshot.docs.forEach(serviceDoc => {
                const serviceData = serviceDoc.data();
                const workerIds = serviceData.workerIds || [];
                if (Array.isArray(workerIds)) {
                  workerIds.forEach(id => {
                    const cleanedId = String(id).trim();
                    if (cleanedId.length > 0 && !allWorkerIds.includes(cleanedId)) {
                      allWorkerIds.push(cleanedId);
                    }
                  });
                }
              });
              console.log(`Encontrados ${servicesSnapshot.docs.length} servicios con nombre "${mappedName}"`);
              console.log('Todos los workerIds combinados:', allWorkerIds);
              setServiceWorkerIds(allWorkerIds);
            }
          }
        }
      } catch (error) {
        console.error('Error cargando servicio:', error);
        // Usar mapeo como fallback
        const mappedName = serviceNameMap[selectedService];
        setServiceName(mappedName || selectedService);
        setServiceWorkerIds([]);
      }
    };

    loadService();
  }, [selectedService]);

  // Cargar workers desde Firebase
  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }
    // Leer workers dinámicamente desde Firebase
    const unsubscribe = onSnapshot(collection(db, 'workers'), (snapshot) => {
      const workersList: Worker[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Sin nombre',
          services: data.services || [], // Array de servicios que puede realizar
        };
      });
      console.log('Workers cargados:', workersList.map(w => ({ id: w.id, name: w.name })));
      setWorkers(workersList);
      setIsLoading(false);
    }, (error) => {
      console.error('Error cargando workers:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtrar workers según el servicio seleccionado usando workerIds del servicio
  useEffect(() => {
    console.log('Efecto de filtrado ejecutado:', {
      selectedService,
      workersCount: workers.length,
      serviceWorkerIdsCount: serviceWorkerIds.length,
      serviceWorkerIds,
      workersIds: workers.map(w => w.id)
    });

    if (!selectedService) {
      // Si no hay servicio seleccionado, mostrar todos los workers
      setFilteredWorkers(workers);
      return;
    }

    // Si el servicio tiene workerIds definidos, filtrar por esos IDs
    if (serviceWorkerIds.length > 0 && workers.length > 0) {
      const filtered = workers.filter(worker => {
        // Verificar si el ID del trabajador está en el array workerIds del servicio
        // Comparar tanto el ID exacto como con trim para evitar problemas de espacios
        const workerIdTrimmed = worker.id.trim();
        const isIncluded = serviceWorkerIds.some(serviceWorkerId => {
          const serviceIdTrimmed = String(serviceWorkerId).trim();
          const matches = workerIdTrimmed === serviceIdTrimmed || worker.id === serviceIdTrimmed;
          if (matches) {
            console.log(`Match encontrado: worker.id="${worker.id}" === serviceWorkerId="${serviceWorkerId}"`);
          }
          return matches;
        });
        return isIncluded;
      });
      console.log('Workers filtrados:', {
        serviceWorkerIds,
        totalWorkers: workers.length,
        filteredCount: filtered.length,
        filteredIds: filtered.map(w => w.id),
        filteredNames: filtered.map(w => w.name),
        filteredWorkers: filtered
      });
      setFilteredWorkers(filtered);
      return;
    }

    // Si no hay workerIds o no hay workers cargados aún, no mostrar nada
    if (serviceWorkerIds.length === 0) {
      console.log('No hay workerIds en el servicio, estableciendo array vacío');
      setFilteredWorkers([]);
      return;
    }

    // Si hay workerIds pero aún no se han cargado los workers, esperar
    if (workers.length === 0) {
      console.log('Workers aún no cargados, esperando...');
      setFilteredWorkers([]);
      return;
    }
  }, [workers, selectedService, serviceWorkerIds]);

  // Log del estado de filteredWorkers para depuración
  useEffect(() => {
    console.log('=== ESTADO DE FILTRADO ===');
    console.log('Cantidad de filteredWorkers:', filteredWorkers.length);
    console.log('IDs de filteredWorkers:', filteredWorkers.map(w => w.id));
    console.log('Nombres de filteredWorkers:', filteredWorkers.map(w => w.name));
    console.log('Array completo:', filteredWorkers);
    console.log('==========================');
  }, [filteredWorkers]);

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
      ) : filteredWorkers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {selectedService 
              ? 'No hay estilistas disponibles para este servicio' 
              : 'No hay estilistas disponibles'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredWorkers.map((worker, index) => {
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

