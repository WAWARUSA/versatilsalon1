'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#151414] border-t border-[#c9a857]/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div>
            <h3 className="text-2xl font-bold font-display text-[#c9a857] mb-4">
              VersatilSalon
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu salón de belleza de confianza. Transformamos tu estilo con profesionalismo y dedicación.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#c9a857] transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/#servicios" className="text-gray-400 hover:text-[#c9a857] transition-colors text-sm">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/cortes" className="text-gray-400 hover:text-[#c9a857] transition-colors text-sm">
                  Cortes
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-400 hover:text-[#c9a857] transition-colors text-sm">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/#reservas" className="text-gray-400 hover:text-[#c9a857] transition-colors text-sm">
                  Reservas
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="text-gray-400 hover:text-[#c9a857] transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <motion.a
                href="https://instagram.com/versatilsalon"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-[#c9a857]/10 hover:bg-[#c9a857]/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-[#c9a857]" />
              </motion.a>
              <motion.a
                href="https://facebook.com/versatilsalon"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-[#c9a857]/10 hover:bg-[#c9a857]/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#c9a857]" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#c9a857]/20 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} VersatilSalon. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}


