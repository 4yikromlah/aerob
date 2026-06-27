/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ScrollReveal from './ScrollReveal';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Cpu, 
  Facebook, 
  Instagram, 
  Youtube, 
  Github, 
  Navigation,
  Globe,
  Clock,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const quickLinks = [
    { label: 'Beranda Utama', id: 'beranda' },
    { label: 'Ringkasan Ekstrakurikuler', id: 'ringkasan' },
    { label: 'Visi & Misi Pendiri', id: 'vision' },
    { label: 'Program Unggulan', id: 'programs' },
    { label: 'Galeri Kegiatan', id: 'gallery' },
    { label: 'Papan Informasi', id: 'news' },
    { label: 'Pelayanan Publik', id: 'services' },
    { label: 'Produk Karya Siswa', id: 'products' },
  ];

  return (
    <footer id="footer" className="bg-slate-950 border-t border-white/5 relative overflow-hidden pt-16 pb-8">
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/5">
          
          {/* Column 1: School Identity */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-cyan/20 border border-brand-cyan/35 text-brand-cyan rounded-xl">
                <Cpu className="w-5 h-5 text-brand-cyan" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white block">
                  ROBOTIKA UNGGULAN
                </span>
                <span className="text-[9px] font-mono text-brand-cyan tracking-widest uppercase block -mt-1 font-semibold">
                  Menejemen Informasi
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Pusat edukasi robotika, pemrograman mikrokontroler, sirkuit IoT, dan otonom drone sekolah menengah pertama. Mencetak inovator masa depan berbasis AI.
            </p>

            {/* Social media buttons */}
            <div className="flex items-center gap-3 pt-1">
              <a href="https://facebook.com" aria-label="Facebook Link" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 border border-white/5 rounded-xl hover:border-brand-cyan/40 text-slate-400 hover:text-brand-cyan transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" aria-label="Instagram Link" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 border border-white/5 rounded-xl hover:border-brand-cyan/40 text-slate-400 hover:text-brand-cyan transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" aria-label="Youtube Link" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 border border-white/5 rounded-xl hover:border-brand-cyan/40 text-slate-400 hover:text-brand-cyan transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://github.com" aria-label="GitHub Link" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 border border-white/5 rounded-xl hover:border-brand-cyan/40 text-slate-400 hover:text-brand-cyan transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick links */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-cyan pl-2 border-l-2 border-brand-cyan">
              Navigasi Pintas
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-medium font-sans">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className="text-left text-slate-400 hover:text-brand-cyan transition-colors py-1 cursor-pointer truncate"
                >
                  • {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Contacts & Google Maps Placeholder */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-purple pl-2 border-l-2 border-brand-purple">
               Kontak & Google Maps Lokasi
            </h3>

            <div className="space-y-2.5 text-xs font-sans text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                <span className="leading-normal">Jl. Raya Iptek Blok C No. 5, Laboratorium Elektronika, Surabaya, Indonesia.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-cyan" />
                <span>robotika@sekolahunggulan.sch.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-cyan" />
                <span>+62 (031)  825-ROBOT</span>
              </div>
            </div>

            {/* Google Maps Skeuomorphic vector canvas */}
            <div className="w-full h-24 bg-slate-900 border border-white/5 rounded-xl overflow-hidden relative group">
              {/* Abstract glowing grid of nodes mimicking real area maps */}
              <div className="absolute inset-0 bg-circuit-pattern opacity-60 group-hover:scale-105 transition-transform duration-500" />
              
              {/* Radar pulse around location pin */}
              <span className="absolute left-[45%] top-[40%] w-8 h-8 -ml-4 -mt-4 bg-brand-cyan/25 rounded-full animate-ping pointer-events-none" />
              
              {/* Pin */}
              <div className="absolute left-[45%] top-[40%] -ml-1.5 -mt-1.5 w-3 h-3 bg-brand-cyan border border-white rounded-full flex items-center justify-center shadow shadow-brand-cyan" />

              {/* Holographic overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 justify-between">
                <span className="text-[8px] font-mono text-brand-cyan uppercase tracking-wider font-semibold">G-MAPS COORDINATES</span>
                <span className="text-[8px] font-mono text-slate-300">7.2575° S, 112.7521° E</span>
              </div>

              {/* Floating Maps search route button */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="absolute right-2 top-2 p-1 bg-slate-950/80 border border-white/10 rounded-lg text-brand-cyan hover:bg-brand-cyan hover:text-white transition-colors"
                title="Buka Peta Komplit"
              >
                <Navigation className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-mono text-slate-500">
          <p>© 2026 Sistem Informasi Manajemen Robotika. All Rights Reserved.</p>
          <div className="flex items-center gap-2 text-slate-600">
            <span>Dirancang oleh</span>
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-cyan" /> Divisi Inovasi Sekolah
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
