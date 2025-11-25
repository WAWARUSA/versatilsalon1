'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', href: '/', isAnchor: false },
    { name: 'Servicios', href: isHomePage ? '#servicios' : '/#servicios', isAnchor: true },
    { name: 'Cortes', href: '/cortes', isAnchor: false },
    { name: 'Nosotros', href: '/nosotros', isAnchor: false },
    { name: 'Reservas', href: isHomePage ? '#reservas' : '/#reservas', isAnchor: true },
    { name: 'Contacto', href: isHomePage ? '#contacto' : '/#contacto', isAnchor: true },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMenuOpen(false);
      }
    } else if (href.startsWith('/#')) {
      // Navigate to home and then scroll
      window.location.href = href;
    }
    setIsMenuOpen(false);
  };

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.isAnchor && isHomePage) {
      e.preventDefault();
      scrollToSection(item.href);
    } else if (item.href.startsWith('/#')) {
      e.preventDefault();
      window.location.href = item.href;
    }
    // For regular links, let Next.js handle it
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1c1b1b]/95 backdrop-blur-md shadow-lg border-b border-[#c9a857]/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl sm:text-3xl font-bold font-display"
              style={{ color: '#c9a857' }}
            >
              VersatilSalon
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isAnchor && isHomePage ? (
                <button
                  key={item.name}
                  onClick={(e) => handleNavClick(item, e)}
                  className="text-sm font-medium text-white hover:text-[#c9a857] transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c9a857] transition-all duration-300 group-hover:w-full"></span>
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className="text-sm font-medium text-white hover:text-[#c9a857] transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c9a857] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/agendar"
                className="bg-[#c9a857] hover:bg-[#d4af37] text-[#1c1b1b] font-bold py-2.5 px-6 rounded-full text-sm transition-all duration-300 shadow-lg hover:shadow-[#c9a857]/30 inline-block"
              >
                Agendar Hora
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-[#c9a857] transition-colors duration-300 p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-4 space-y-1 bg-[#1c1b1b]/98 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-[#c9a857]/20">
                {navItems.map((item) => (
                  item.isAnchor && isHomePage ? (
                    <button
                      key={item.name}
                      onClick={(e) => handleNavClick(item, e)}
                      className="text-white hover:text-[#c9a857] hover:bg-[#c9a857]/10 block w-full text-left px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className="text-white hover:text-[#c9a857] hover:bg-[#c9a857]/10 block w-full text-left px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg"
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                <Link
                  href="/agendar"
                  className="bg-[#c9a857] hover:bg-[#d4af37] text-[#1c1b1b] font-bold py-3 px-4 rounded-lg text-center block w-full mt-2 transition-all duration-300"
                >
                  Agendar Hora
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}


