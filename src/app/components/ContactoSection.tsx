'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function ContactoSection() {
  return (
    <section id="contacto" className="py-20 sm:py-24 bg-[#151414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Contáctanos
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Visítanos o contáctanos a través de cualquiera de nuestros canales.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden border border-[#c9a857]/20"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.5!2d-70.6483!3d-33.4489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI2JzU2LjAiUyA3MMKwMzgnNTQuOSJX!5e0!3m2!1ses!2scl!4v1234567890"
              width="100%"
              height="100%"
              style={{ minHeight: '400px', border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="bg-[#1c1b1b] border border-[#c9a857]/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold font-display text-white mb-6">
                Información de <span className="text-[#c9a857]">Contacto</span>
              </h3>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-[#c9a857]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#c9a857]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Dirección</h4>
                    <p className="text-gray-400">
                      Av. Principal 123, Santiago, Chile
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-[#c9a857]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#c9a857]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Teléfono</h4>
                    <a href="tel:+56912345678" className="text-gray-400 hover:text-[#c9a857] transition-colors">
                      +56 9 1234 5678
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-[#c9a857]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#c9a857]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Correo</h4>
                    <a href="mailto:contacto@versatilsalon.com" className="text-gray-400 hover:text-[#c9a857] transition-colors">
                      contacto@versatilsalon.com
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Social Media */}
              <div className="mt-8 pt-8 border-t border-[#c9a857]/20">
                <h4 className="text-white font-semibold mb-4">Síguenos en:</h4>
                <div className="flex space-x-4">
                  <motion.a
                    href="https://instagram.com/versatilsalon"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-[#c9a857]/10 hover:bg-[#c9a857]/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-6 h-6 text-[#c9a857]" />
                  </motion.a>
                  <motion.a
                    href="https://facebook.com/versatilsalon"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-[#c9a857]/10 hover:bg-[#c9a857]/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-[#c9a857]" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


