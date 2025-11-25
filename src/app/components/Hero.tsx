'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function Hero() {

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1c1b1b]">
      {/* Background Image/Video with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1920")',
            filter: 'blur(2px) brightness(0.3)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1b1b]/80 via-[#1c1b1b]/60 to-[#1c1b1b]/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 leading-tight"
          >
            Renueva tu estilo con{' '}
            <span className="text-[#c9a857]">VersatilSalon</span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Descubre la excelencia en belleza y estilo. Nuestros profesionales certificados 
          te brindan una experiencia única con técnicas modernas y productos de primera calidad.
        </motion.p>

        <Link href="/agendar">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#c9a857] hover:bg-[#d4af37] text-[#1c1b1b] font-bold py-4 px-8 sm:px-12 rounded-full text-base sm:text-lg transition-all duration-300 shadow-2xl hover:shadow-[#c9a857]/40 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              Reserva tu cita ahora
              <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </span>
          </motion.button>
        </Link>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white cursor-pointer"
          onClick={() => {
            const element = document.querySelector('#servicios');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <ChevronDown size={32} className="text-[#c9a857]" />
        </motion.div>
      </motion.div>
    </section>
  );
}


