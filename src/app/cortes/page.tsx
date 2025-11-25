'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';

// Placeholder images - replace with actual images
const cortes = [
  { id: 1, image: 'https://images.unsplash.com/photo-1560869713-8f2b3d0e1b5a?w=400&h=500&fit=crop' },
  { id: 2, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop' },
  { id: 3, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop' },
  { id: 4, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop' },
  { id: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop' },
  { id: 6, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop' },
  { id: 7, image: 'https://images.unsplash.com/photo-1560869713-8f2b3d0e1b5a?w=400&h=500&fit=crop' },
  { id: 8, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop' },
];

export default function CortesPage() {
  return (
    <main className="min-h-screen bg-[#1c1b1b]">
      <Header />
      <section className="pt-32 pb-20 sm:pt-36 sm:pb-24 bg-[#151414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-white mb-4">
              Cortes <span className="text-[#c9a857]">Destacados</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Galería de nuestros trabajos más recientes. Inspírate con nuestros estilos únicos.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {cortes.map((corte, index) => (
              <motion.div
                key={corte.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group overflow-hidden rounded-lg cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={corte.image}
                    alt={`Corte ${corte.id}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-[#c9a857] rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform">
                      <ZoomIn className="w-6 h-6 text-[#1c1b1b]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
