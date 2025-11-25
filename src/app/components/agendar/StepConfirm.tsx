'use client';

import { motion } from 'framer-motion';
import { User, Phone, Mail, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface StepConfirmProps {
  formData: {
    nombre: string;
    telefono: string;
    correo: string;
    comentario: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export default function StepConfirm({ formData, onFormChange }: StepConfirmProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'nombre':
        if (!value.trim()) {
          newErrors.nombre = 'El nombre es requerido';
        } else {
          delete newErrors.nombre;
        }
        break;
      case 'telefono':
        if (!value.trim()) {
          newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\+?[\d\s-]+$/.test(value)) {
          newErrors.telefono = 'Teléfono inválido';
        } else {
          delete newErrors.telefono;
        }
        break;
      case 'correo':
        if (!value.trim()) {
          newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.correo = 'Correo inválido';
        } else {
          delete newErrors.correo;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    onFormChange(field, value);
    validateField(field, value);
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
          Confirma tus datos
        </h2>
        <p className="text-gray-400">
          Ingresa tu información de contacto para confirmar tu reserva
        </p>
      </div>

      <div className="space-y-6">
        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2"
          >
            <User className="w-4 h-4 text-[#c9a857]" />
            <span>Nombre Completo *</span>
          </label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            onBlur={(e) => validateField('nombre', e.target.value)}
            className={`
              w-full px-4 py-3 bg-[#151414] border-2 rounded-lg text-white
              placeholder-gray-500 focus:outline-none transition-all duration-300
              ${
                errors.nombre
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#151414] focus:border-[#c9a857]'
              }
            `}
            placeholder="Tu nombre completo"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="telefono"
            className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2"
          >
            <Phone className="w-4 h-4 text-[#c9a857]" />
            <span>Teléfono *</span>
          </label>
          <input
            type="tel"
            id="telefono"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            onBlur={(e) => validateField('telefono', e.target.value)}
            className={`
              w-full px-4 py-3 bg-[#151414] border-2 rounded-lg text-white
              placeholder-gray-500 focus:outline-none transition-all duration-300
              ${
                errors.telefono
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#151414] focus:border-[#c9a857]'
              }
            `}
            placeholder="+56 9 1234 5678"
          />
          {errors.telefono && (
            <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>
          )}
        </div>

        {/* Correo */}
        <div>
          <label
            htmlFor="correo"
            className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2"
          >
            <Mail className="w-4 h-4 text-[#c9a857]" />
            <span>Correo Electrónico *</span>
          </label>
          <input
            type="email"
            id="correo"
            value={formData.correo}
            onChange={(e) => handleChange('correo', e.target.value)}
            onBlur={(e) => validateField('correo', e.target.value)}
            className={`
              w-full px-4 py-3 bg-[#151414] border-2 rounded-lg text-white
              placeholder-gray-500 focus:outline-none transition-all duration-300
              ${
                errors.correo
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#151414] focus:border-[#c9a857]'
              }
            `}
            placeholder="tu@correo.com"
          />
          {errors.correo && (
            <p className="mt-1 text-sm text-red-500">{errors.correo}</p>
          )}
        </div>

        {/* Comentario */}
        <div>
          <label
            htmlFor="comentario"
            className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2"
          >
            <MessageSquare className="w-4 h-4 text-[#c9a857]" />
            <span>Comentario (opcional)</span>
          </label>
          <textarea
            id="comentario"
            value={formData.comentario}
            onChange={(e) => handleChange('comentario', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-[#151414] border-2 border-[#151414] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a857] transition-all duration-300 resize-none"
            placeholder="Agrega algún comentario o solicitud especial..."
          />
        </div>
      </div>
    </motion.div>
  );
}

