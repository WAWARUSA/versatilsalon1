'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ReservasSection() {
  return (
    <section id="reservas" className="py-20 sm:py-24 bg-[#1c1b1b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Reserva tu <span className="text-[#c9a857]">Cita</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Agenda tu cita con nosotros y transforma tu estilo. Sigue los pasos para completar tu reserva.
          </p>
          <Link href="/agendar">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#c9a857] hover:bg-[#d4af37] text-[#1c1b1b] font-bold py-4 px-8 sm:px-12 rounded-full text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-[#c9a857]/30 inline-flex items-center gap-2"
            >
              Agendar hora
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


