/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Menu, X, LogIn, User, LayoutDashboard, LogOut } from 'lucide-react';

interface NavbarProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  isLoggedIn: boolean;
  userRole?: string;
  userName?: string;
  onLogout: () => void;
  onOpenLogin: () => void;
  customLogo?: string;
}

export default function Navbar({
  currentSection,
  onNavigate,
  isLoggedIn,
  userRole,
  userName,
  onLogout,
  onOpenLogin,
  customLogo = '',
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'ringkasan', label: 'Ringkasan' },
    { id: 'vision', label: 'Visi & Misi' },
    { id: 'programs', label: 'Program Unggulan' },
    { id: 'gallery', label: 'Galeri Kegiatan' },
    { id: 'news', label: 'Informasi' },
    { id: 'services', label: 'Pelayanan' },
    { id: 'products', label: 'Galeri Produk' },
    ...(isLoggedIn ? [{ id: 'learning', label: 'Pembelajaran 📚' }] : []),
  ];

  const handleMenuClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <header
      id="navbar"
      className={`liquid-glass-header ${
        scrolled
          ? 'scrolled-liquid py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleMenuClick('beranda')}
            className="flex items-center gap-3 group text-left cursor-pointer"
            id="nav-logo"
          >
            <div className="relative w-10 h-10 rounded-xl border border-brand-blue/30 group-hover:border-brand-cyan/60 transition-all duration-300 flex items-center justify-center overflow-hidden bg-slate-950">
              {customLogo ? (
                <img src={customLogo} alt="AEROB Logo" className="max-w-full max-h-full object-contain p-1" referrerPolicy="no-referrer" />
              ) : (
                <Cpu className="w-6 h-6 text-brand-cyan animate-pulse" />
              )}
              <div className="absolute -inset-0.5 bg-brand-cyan/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
            </div>
            <div>
              <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white block">
                ROBOTIKA
              </span>
              <span className="text-[10px] font-mono text-brand-cyan tracking-widest uppercase block -mt-1 font-semibold">
                Sistem Informasi
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleMenuClick(item.id)}
                  className={`relative px-3.5 py-2 rounded-lg font-display text-xs font-medium tracking-wide transition-colors cursor-pointer duration-300 ${
                    isActive ? 'text-brand-cyan font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute inset-0 bg-brand-blue/10 border-b-2 border-brand-cyan rounded-lg z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Section / Login */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 bg-slate-900/60 pl-3 pr-1 py-1 rounded-full border border-white/5">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">{userName}</p>
                  <p className="text-[9px] font-mono text-brand-cyan uppercase tracking-wider">{userRole}</p>
                </div>
                {(userRole === 'Pembina' || userRole === 'Admin' || userRole === 'Super Admin') && (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    id="nav-btn-dashboard"
                    aria-label="Akses Dashboard"
                    className="p-1 px-3 bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan rounded-full border border-brand-cyan/30 flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all duration-300"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Panel
                  </button>
                )}
                <button
                  onClick={onLogout}
                  id="nav-btn-logout"
                  aria-label="Logout"
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-brand-purple hover:bg-slate-700/80 rounded-full transition-colors duration-300 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                id="nav-btn-login"
                className="relative overflow-hidden group px-5 py-2 rounded-xl text-xs font-semibold tracking-wide cursor-pointer flex items-center gap-2 transition-all duration-300 text-white bg-gradient-to-r from-brand-blue to-brand-cyan shadow-md shadow-brand-blue/20 hover:shadow-brand-cyan/30 active:scale-95"
              >
                <LogIn className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                <span>Portal Anggota</span>
                <span className="absolute -inset-0.5 bg-white/20 blur opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl" />
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-3">
            {isLoggedIn && (userRole === 'Pembina' || userRole === 'Admin' || userRole === 'Super Admin') && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 bg-slate-900/60 rounded-xl border border-white/5 text-brand-cyan"
                title="Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="nav-menu-mobile"
              className="p-2 bg-slate-900/60 rounded-xl border border-white/5 text-slate-300 hover:text-white hover:border-brand-blue/30 active:scale-95"
            >
              {isOpen ? <X className="w-5 h-5 text-brand-cyan" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-navy/95 border-b border-white/5 overflow-hidden fixed top-[60px] left-0 w-full backdrop-blur-xl z-40 transition-all"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              <p className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider px-3 px-y">Menu Navigasi</p>
              {menuItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-mobile-${item.id}`}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-display text-sm font-medium transition-colors block ${
                      isActive
                        ? 'bg-brand-blue/15 text-brand-cyan border-l-2 border-brand-cyan'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-white/5">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="px-4 py-2 bg-slate-900/50 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{userName}</p>
                        <p className="text-[9px] font-mono text-brand-cyan tracking-wider uppercase">{userRole}</p>
                      </div>
                      <span className="p-1 px-2.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-[9px] font-semibold uppercase">
                        Aktif
                      </span>
                    </div>
                    <div className={`grid ${userRole === 'Pembina' || userRole === 'Admin' || userRole === 'Super Admin' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                      {(userRole === 'Pembina' || userRole === 'Admin' || userRole === 'Super Admin') && (
                        <button
                          onClick={() => handleMenuClick('dashboard')}
                          className="p-2.5 bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-cyan border border-brand-blue/30 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onLogout();
                          setIsOpen(false);
                        }}
                        className="p-2.5 bg-red-950/20 hover:bg-red-950/30 text-red-400 border border-red-500/10 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Keluar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setIsOpen(false);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-blue/20"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Portal / Login Anggota</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
