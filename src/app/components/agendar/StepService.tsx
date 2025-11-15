'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Palette, Sparkles, Hand, Heart, Sparkle } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  firebaseId?: string; // ID en Firebase para mapeo
}

// Servicios base con iconos y descripciones (para UI)
// Estos se mapean a servicios en Firebase por nombre
const baseServices: Omit<Service, 'firebaseId'>[] = [
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

interface FirebaseService {
  id: string;
  name: string;
  duration?: number;
  price?: number;
  isActive?: boolean;
  [key: string]: unknown;
}

export default function StepService({ selectedService, onSelect }: StepServiceProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar servicios desde Firebase
  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const services: FirebaseService[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: (data.name as string) || '',
          duration: data.duration as number | undefined,
          price: data.price as number | undefined,
          isActive: data.isActive as boolean | undefined,
          ...data,
        } as FirebaseService;
      });
      setFirebaseServices(services);
      setIsLoading(false);
    }, (error) => {
      console.error('Error cargando servicios:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Combinar servicios base con servicios de Firebase
  // Si un servicio de Firebase coincide por nombre con uno base, usar el de Firebase
  // Si no, agregar servicios adicionales de Firebase
  const services: Service[] = baseServices.map(baseService => {
    const firebaseService = firebaseServices.find(
      fs => fs.name === baseService.name && (fs.isActive !== false)
    );
    return {
      ...baseService,
      firebaseId: firebaseService?.id,
    };
  });

  // Agregar servicios de Firebase que no están en la lista base
  firebaseServices.forEach(fs => {
    if (fs.isActive !== false && !services.find(s => s.name === fs.name)) {
      // Asignar icono por defecto según el nombre
      let icon = Sparkle;
      if (fs.name.toLowerCase().includes('corte')) icon = Scissors;
      else if (fs.name.toLowerCase().includes('color')) icon = Palette;
      else if (fs.name.toLowerCase().includes('peinado')) icon = Sparkles;
      else if (fs.name.toLowerCase().includes('manicure') || fs.name.toLowerCase().includes('uña')) icon = Hand;
      else if (fs.name.toLowerCase().includes('tratamiento')) icon = Heart;

      services.push({
        id: fs.name.toLowerCase().replace(/\s+/g, '-'),
        name: fs.name,
        icon,
        description: (fs.description as string) || 'Servicio profesional',
        firebaseId: fs.id,
      });
    }
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full"
      >
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
            Selecciona tu servicio
          </h2>
          <p className="text-gray-400">Cargando servicios...</p>
        </div>
      </motion.div>
    );
  }

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
          // Comparar tanto con el ID base como con el firebaseId
          const isSelected = selectedService === service.id || selectedService === service.firebaseId;

          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(service.firebaseId || service.id)}
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

