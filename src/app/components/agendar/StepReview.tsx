'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, User, Scissors, Mail, Phone } from 'lucide-react';

interface StepReviewProps {
  selectedService: string;
  selectedStylist: string;
  selectedDate: string;
  selectedTime: string;
  formData: {
    nombre: string;
    telefono: string;
    correo: string;
    comentario: string;
  };
  onConfirm: () => void;
}

const serviceNames: { [key: string]: string } = {
  corte: 'Corte de Cabello',
  coloracion: 'Coloración',
  peinado: 'Peinado',
  manicure: 'Manicure',
  tratamiento: 'Tratamiento Capilar',
  premium: 'Servicios Premium',
};

const stylistNames: { [key: string]: string } = {
  '1': 'María González',
  '2': 'Carlos Rodríguez',
  '3': 'Ana Martínez',
  '4': 'Laura Sánchez',
};

export default function StepReview({
  selectedService,
  selectedStylist,
  selectedDate,
  selectedTime,
  formData,
  onConfirm,
}: StepReviewProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

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
          Revisión y confirmación
        </h2>
        <p className="text-gray-400">
          Revisa los detalles de tu reserva antes de confirmar
        </p>
      </div>

      <div className="space-y-6">
        {/* Service */}
        <div className="bg-[#151414] border border-[#c9a857]/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Scissors className="w-5 h-5 text-[#c9a857]" />
            <h3 className="font-semibold text-white">Servicio</h3>
          </div>
          <p className="text-gray-300">{serviceNames[selectedService] || selectedService}</p>
        </div>

        {/* Stylist */}
        <div className="bg-[#151414] border border-[#c9a857]/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <User className="w-5 h-5 text-[#c9a857]" />
            <h3 className="font-semibold text-white">Estilista</h3>
          </div>
          <p className="text-gray-300">{stylistNames[selectedStylist] || selectedStylist}</p>
        </div>

        {/* Date and Time */}
        <div className="bg-[#151414] border border-[#c9a857]/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-5 h-5 text-[#c9a857]" />
            <h3 className="font-semibold text-white">Fecha y Hora</h3>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-300">{formatDate(selectedDate)}</p>
            <Clock className="w-4 h-4 text-[#c9a857]" />
            <p className="text-gray-300 font-medium">{selectedTime}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#151414] border border-[#c9a857]/20 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Información de Contacto</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-[#c9a857]" />
              <p className="text-gray-300">{formData.nombre}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-[#c9a857]" />
              <p className="text-gray-300">{formData.telefono}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-[#c9a857]" />
              <p className="text-gray-300">{formData.correo}</p>
            </div>
          </div>
          {formData.comentario && (
            <div className="mt-4 pt-4 border-t border-[#151414]">
              <p className="text-sm text-gray-400 mb-1">Comentario:</p>
              <p className="text-gray-300">{formData.comentario}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onConfirm}
        className="w-full mt-8 bg-[#c9a857] hover:bg-[#d4af37] text-[#1c1b1b] font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-[#c9a857]/30 flex items-center justify-center space-x-2"
      >
        <CheckCircle className="w-5 h-5" />
        <span>Confirmar Reserva</span>
      </motion.button>
    </motion.div>
  );
}

