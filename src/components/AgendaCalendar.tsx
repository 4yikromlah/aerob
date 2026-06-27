/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Tag, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface AgendaEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  category: 'Latihan' | 'Kompetisi' | 'Rapat' | 'Workshop';
  division: 'Semua' | 'Line Follower' | 'IoT' | 'Drone' | 'AI';
  description: string;
  status: 'Akan Datang' | 'Selesai' | 'Dibatalkan';
}

export default function AgendaCalendar() {
  const events: AgendaEvent[] = [
    {
      id: 'e1',
      title: 'Latihan Rutin: Kalibrasi PID & Motor Line Follower',
      date: '2026-06-23', // Tuesday
      time: '15.00 - 17.30',
      location: 'Laboratorium Elektronika',
      category: 'Latihan',
      division: 'Line Follower',
      description: 'Latihan wajib fokus kalibrasi koefisien PID sensor analog-to-digital pada sasis serat karbon RoboSpeed v2.',
      status: 'Akan Datang'
    },
    {
      id: 'e2',
      title: 'Workshop Otonom Drone Waypoint GPS & Telemetri',
      date: '2026-06-25', // Thursday
      time: '15.00 - 17.30',
      location: 'Aula Out-door Lantai 3',
      category: 'Workshop',
      division: 'Drone',
      description: 'Pengenalan APM/Pixhawk flight controller, kalibrasi sensor kompas otonom, dan simulasi misi terbang.',
      status: 'Akan Datang'
    },
    {
      id: 'e3',
      title: 'Rapat Evaluasi Triwulan & Progress Pendanaan Kompetisi',
      date: '2026-06-27', // Saturday
      time: '10.00 - 12.00',
      location: 'Smart Lab Ruang Riset',
      category: 'Rapat',
      division: 'Semua',
      description: 'Rapat penting bersama pembina Ir. Hermawan membahas proposal dana kejuaraan robotic internasional di Tokyo.',
      status: 'Akan Datang'
    },
    {
      id: 'e4',
      title: 'Sertifikasi Kompetensi Trainer Robotika Nasional',
      date: '2026-06-15',
      time: '08.00 - 16.00',
      location: 'Laboratorium Utama',
      category: 'Kompetisi',
      division: 'Semua',
      description: 'Ujian pembuktian keahlian rangkaian elektronika dasar bagi anggota angkatan ke-10.',
      status: 'Selesai'
    },
    {
      id: 'e5',
      title: 'Latihan Intensif Komparator & Logika Coding Arduino',
      date: '2026-06-30',
      time: '14.30 - 17.00',
      location: 'Laboratorium Elektronika',
      category: 'Latihan',
      division: 'IoT',
      description: 'Membahas logika conditional, PIN I/O interfacing, sirkuit servo, dan debugging skematik breadboard.',
      status: 'Akan Datang'
    }
  ];

  // Simple agenda filter states
  const [filterCategory, setFilterCategory] = useState<'Semua' | 'Latihan' | 'Kompetisi' | 'Rapat' | 'Workshop'>('Semua');

  const filteredEvents = events.filter((e) => {
    if (filterCategory === 'Semua') return true;
    return e.category === filterCategory;
  });

  const getCategoryTheme = (cat: AgendaEvent['category']) => {
    switch (cat) {
      case 'Latihan':
        return 'bg-brand-blue/15 text-brand-sky border-brand-blue/20';
      case 'Kompetisi':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Rapat':
        return 'bg-brand-purple/15 text-brand-purple border-brand-purple/20';
      case 'Workshop':
      default:
        return 'bg-emerald-500/10 text-green-400 border-emerald-500/20';
    }
  };

  return (
    <section id="agenda" className="py-20 relative overflow-hidden bg-[#070a13]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
        <ScrollReveal variant="fadeUp" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Kalender Kegiatan & Agenda
            </h2>
            <div className="w-16 h-1.5 bg-brand-cyan rounded-full mx-auto mt-4 mb-4" />
            <p className="text-sm font-sans text-slate-400 font-light">
              Pantau jadwal pelatihan mingguan, rapat divisi riset pembina, pendaftaran kompetisi nasional, serta seminar teknologi robotika di laboratorium kami.
            </p>

            {/* Quick Filter tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {(['Semua', 'Latihan', 'Kompetisi', 'Rapat', 'Workshop'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-mono font-semibold cursor-pointer transition-all ${
                    filterCategory === cat
                      ? 'bg-brand-cyan text-slate-950 border-brand-cyan'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Schedule list layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredEvents.map((item, idx) => (
            <ScrollReveal key={item.id} variant="fadeUp" delay={120 + idx * 50}>
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/5 hover:border-brand-cyan/20 hover:shadow-lg hover:shadow-brand-cyan/5 transition-all duration-300 flex flex-col justify-between h-full group relative">
                
                {/* Visual Category Label */}
                <div className="flex justify-between items-start gap-4 mb-4 flex-row">
                  <div className="flex gap-2 items-center">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono border font-semibold ${getCategoryTheme(item.category)}`}>
                      {item.category.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono border border-white/5 bg-slate-900 text-slate-400 font-semibold">
                      DIV: {item.division.toUpperCase()}
                    </span>
                  </div>

                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${item.status === 'Selesai' ? 'bg-slate-900 text-slate-500 border border-white/5' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans font-light line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Date / Time / Location visual cues */}
                <div className="mt-6 pt-4 border-t border-white/5 space-y-2 font-mono text-[9px] sm:text-[10px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span>TANGGAL: {item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span>WAKTU: {item.time} WIB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">LOKASI: {item.location}</span>
                  </div>
                </div>

                {/* Card Corner Deco for branding */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-105 transition-opacity pointer-events-none select-none">
                  <Bookmark className="w-4 h-4 text-brand-cyan/20" />
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
