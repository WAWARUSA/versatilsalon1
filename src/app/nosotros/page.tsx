'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Users, Award, Heart } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-[#1c1b1b]">
      <Header />
      <section className="pt-32 pb-20 sm:pt-36 sm:pb-24 bg-gradient-to-b from-[#1c1b1b] to-[#151414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-white mb-4">
              Sobre <span className="text-[#c9a857]">Nosotros</span>
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=600&fit=crop"
                  alt="VersatilSalon - Equipo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#c9a857]/20 rounded-full blur-3xl z-0"></div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:pl-8"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-6">
                Nuestra <span className="text-[#c9a857]">Historia</span>
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                En VersatilSalon, creemos que cada persona tiene un estilo único que merece ser destacado. 
                Desde nuestros inicios, nos hemos dedicado a ofrecer servicios de belleza de la más alta calidad, 
                combinando técnicas tradicionales con las últimas tendencias en moda y estilo.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Nuestro equipo está formado por profesionales certificados con años de experiencia, 
                comprometidos con brindarte una experiencia personalizada y resultados excepcionales. 
                Utilizamos solo productos de primera calidad y técnicas modernas para garantizar tu satisfacción.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-[#c9a857]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-[#c9a857]" />
                  </div>
                  <div className="text-2xl font-bold text-[#c9a857] mb-1">500+</div>
                  <div className="text-sm text-gray-400">Clientes Felices</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-[#c9a857]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-[#c9a857]" />
                  </div>
                  <div className="text-2xl font-bold text-[#c9a857] mb-1">5+</div>
                  <div className="text-sm text-gray-400">Años de Experiencia</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-[#c9a857]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-[#c9a857]" />
                  </div>
                  <div className="text-2xl font-bold text-[#c9a857] mb-1">100%</div>
                  <div className="text-sm text-gray-400">Satisfacción</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
