'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-[#151414] border-2 border-[#c9a857] rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-[#c9a857] rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-[#1c1b1b]" />
                </motion.div>

                <h3 className="text-2xl font-bold font-display text-white mb-3">
                  ¡Reserva Registrada!
                </h3>
                <p className="text-gray-300 mb-6">
                  Tu reserva ha sido registrada con éxito. Te contactaremos para confirmar.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/"
                    className="flex-1 bg-[#c9a857] hover:bg-[#d4af37] text-[#1c1b1b] font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
                  >
                    Volver al inicio
                  </Link>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-[#151414] border-2 border-[#c9a857] text-[#c9a857] font-bold py-3 px-6 rounded-lg hover:bg-[#c9a857]/10 transition-all duration-300"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

