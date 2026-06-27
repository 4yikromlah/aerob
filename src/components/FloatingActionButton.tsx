/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Mail, ChevronUp, Plus, X, PhoneCall } from 'lucide-react';

export default function FloatingActionButton({ whatsappNumber }: { whatsappNumber?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScrollVisibility = () => {
      if (window.scrollY > 250) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', handleScrollVisibility);
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setIsOpen(false);
  };

  const waNum = whatsappNumber || '628123456789';

  const menuItems = [
    {
      id: 'wa',
      label: 'Hubungi WhatsApp',
      icon: <MessageSquare className="w-4 h-4" />,
      href: `https://wa.me/${waNum}?text=Halo%20Admin%20Robotika%21%20Saya%20ingin%20bertanya%20seputar%20pendaftaran%20ekstra%20robotika.`,
      color: 'bg-green-600 hover:bg-green-500 text-white border-green-500/20'
    },
    {
      id: 'email',
      label: 'Kirim Surel Email',
      icon: <Mail className="w-4 h-4" />,
      href: 'mailto:robotika@sekolahunggulan.sch.id?subject=Tanya%20Ekstrakurikuler%20Robotika',
      color: 'bg-brand-blue hover:bg-brand-blue/80 text-white border-brand-blue/20'
    }
  ];

  return (
    <div id="fab-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      
      {/* Sub menu choices when FAB expanded */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-center gap-2 mb-1">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                id={`fab-sub-${item.id}`}
                className={`p-3.5 rounded-full border shadow-xl flex items-center justify-center transition-all cursor-pointer relative group ${item.color}`}
                initial={{ opacity: 0, scale: 0.5, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 15 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                {item.icon}

                {/* Tooltip helper tag left */}
                <span className="absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 border border-white/10 rounded-lg text-[10px] font-mono text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md shadow-black/80">
                  {item.label}
                </span>
              </motion.a>
            ))}

            {/* Scroll to top as an active option when scrolled down */}
            {showScroll && (
              <motion.button
                onClick={scrollToTop}
                id="fab-sub-scroll"
                className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-brand-cyan rounded-full shadow-xl flex items-center justify-center cursor-pointer relative group"
                initial={{ opacity: 0, scale: 0.5, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 15 }}
              >
                <ChevronUp className="w-4 h-4" />
                <span className="absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 border border-white/10 rounded-lg text-[10px] font-mono text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Kembali ke Atas
                </span>
              </motion.button>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Main trigger button FAB, animated floating bounce */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="fab-main-trigger"
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative border cursor-pointer hover:scale-105 active:scale-95 transition-all outline-none ${
          isOpen
            ? 'bg-slate-950 text-slate-300 border-white/10'
            : 'bg-gradient-to-r from-brand-blue to-brand-cyan text-white border-white/10'
        }`}
        style={{
          boxShadow: !isOpen ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none'
        }}
        title="Buka Pusat Bantuan"
      >
        {/* Floating background glowing ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full border-2 border-brand-cyan/40 animate-ping opacity-60" />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center justify-center"
            >
              <PhoneCall className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
