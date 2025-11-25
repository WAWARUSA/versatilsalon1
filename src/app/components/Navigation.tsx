'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Reservar Cita', href: '/reservas' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-500 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent"></div>
                <div className="relative z-10">
                  <span className="text-black font-bold text-lg tracking-tight">VS</span>
                </div>
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold transition-colors duration-500 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Versátil Salón
                </h1>
                <p className={`text-xs transition-colors duration-500 ${
                  isScrolled ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  Cecilia Gómez
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-500 rounded-lg hover:bg-amber-500/10 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-amber-600' 
                      : 'text-white hover:text-amber-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/reservas"
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-500 text-black font-bold py-3 px-4 sm:px-6 rounded-full text-xs sm:text-sm transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-amber-500/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-transparent"></div>
              <span className="relative z-10">Reservar Ahora</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-pink-600 hover:bg-gray-100' 
                  : 'text-white hover:text-pink-300 hover:bg-white/10'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 block px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <Link
                  href="/reservas"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg text-center block transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reservar Ahora
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
