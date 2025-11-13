'use client';

import { motion } from 'framer-motion';
import { Scissors, Palette, Sparkles, Heart, Hand, Sparkle } from 'lucide-react';

const servicios = [
  {
    icon: Scissors,
    title: 'Coloración',
    description: 'Tintes y mechas profesionales con productos de primera calidad.',
    color: '#c9a857',
  },
  {
    icon: Palette,
    title: 'Barbería',
    description: 'Cortes clásicos y modernos con técnicas tradicionales y contemporáneas.',
    color: '#c9a857',
  },
  {
    icon: Sparkles,
    title: 'Peinados',
    description: 'Peinados para ocasiones especiales y eventos únicos.',
    color: '#c9a857',
  },
  {
    icon: Hand,
    title: 'Manicure',
    description: 'Cuidado y decoración de uñas con técnicas profesionales.',
    color: '#c9a857',
  },
  {
    icon: Heart,
    title: 'Tratamientos',
    description: 'Tratamientos capilares para restaurar y nutrir tu cabello.',
    color: '#c9a857',
  },
  {
    icon: Sparkle,
    title: 'Servicios Premium',
    description: 'Experiencias personalizadas con productos exclusivos.',
    color: '#c9a857',
  },
];

export default function ServiciosSection() {
  return (
    <section id="servicios" className="py-20 sm:py-24 bg-[#1c1b1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Nuestros <span className="text-[#c9a857]">Servicios</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Ofrecemos una amplia gama de servicios profesionales diseñados para realzar tu belleza natural
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicios.map((servicio, index) => (
            <motion.div
              key={servicio.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-[#151414] border border-[#c9a857]/20 rounded-2xl p-8 hover:border-[#c9a857]/50 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#c9a857]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#c9a857]/20 transition-colors">
                <servicio.icon className="w-8 h-8 text-[#c9a857]" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-3 group-hover:text-[#c9a857] transition-colors">
                {servicio.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {servicio.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


