'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = '56912345678'; // Replace with actual WhatsApp number
  const message = encodeURIComponent('Hola! Quisiera agendar una hora en VersatilSalon');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: scrollY > 100 ? -5 : 0,
      }}
      whileHover={{ 
        scale: 1.1,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        y: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <motion.div
        className="w-14 h-14 sm:w-16 sm:h-16 bg-[#c9a857] rounded-full flex items-center justify-center shadow-lg cursor-pointer relative z-10"
        animate={{
          boxShadow: [
            '0 4px 20px rgba(201, 168, 87, 0.4)',
            '0 6px 25px rgba(201, 168, 87, 0.5)',
            '0 4px 20px rgba(201, 168, 87, 0.4)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#1c1b1b] relative z-10" />
        
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#c9a857]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>
    </motion.a>
  );
}

