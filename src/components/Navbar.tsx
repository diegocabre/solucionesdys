'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { setDrawerOpen, getTotalItems } = useCartStore();
  
  // Hidratación segura para Next.js y Zustand
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const NAV_LINKS = [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/productos' },
    { label: 'Transporte', href: '#transporte' },
    { label: 'Consultoría', href: '#consultoria' },
    { label: 'Webs', href: '#webs' },
    { label: 'Contacto', href: '/contacto' },
  ];

  return (
    <nav className="fixed w-full bg-background border-b z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif text-brand-primary tracking-wide">
              Soluciones <span className="font-bold text-brand-accent">DyS</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
               <Link 
                key={link.label} 
                href={link.href} 
                className="text-foreground hover:text-brand-accent transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
            
            <button onClick={() => setDrawerOpen(true)} className="relative p-2 text-foreground hover:text-brand-accent">
              <ShoppingCart size={20} />
              {mounted && getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-accent rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={() => setDrawerOpen(true)} className="relative p-2 text-foreground hover:text-brand-accent">
              <ShoppingCart size={20} />
              {mounted && getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-accent rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button 
              onClick={toggleMenu} 
              className="p-2 text-foreground hover:bg-gray-100 rounded-md focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden bg-background"
          >
            <div className="flex flex-col px-4 pt-2 pb-6 space-y-1 shadow-inner">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-foreground hover:text-brand-accent hover:bg-gray-50 rounded-md"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
