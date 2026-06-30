/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import CountUp from './CountUp';
import logoEmblem from '../assets/images/aerob_logo_emblem_1782468321284.jpg';
import { EXTRACURRICULAR_PROFILE, GENERAL_ACHIEVEMENTS } from '../data/roboticsData';
import { ShieldAlert, Trophy, Award, Calendar, Users, Cpu, Rocket, ChevronRight } from 'lucide-react';

interface OverviewProps {
  onDiscoverProductsClick: () => void;
  membersCount: number;
  productsCount: number;
  customLogo?: string;
  summary?: {
    name: string;
    school: string;
    foundedYear: number;
    philosophy: string;
    description: string;
    history: string;
    instructors?: {
      id: string;
      name: string;
      role: string;
      specialty: string;
      imageUrl: string;
      bio: string;
    }[];
  };
  achievements?: {
    id: string;
    title: string;
    year: string;
    rank: string;
    level: string;
    description: string;
  }[];
}

export default function Overview({ 
  onDiscoverProductsClick, 
  membersCount, 
  productsCount,
  customLogo = '',
  summary = EXTRACURRICULAR_PROFILE,
  achievements = GENERAL_ACHIEVEMENTS
}: OverviewProps) {

  const getStatIcon = (label: string) => {
    switch (label) {
      case 'Anggota Aktif':
        return <Users className="w-6 h-6 text-brand-cyan" />;
      case 'Prestasi Juara':
        return <Trophy className="w-6 h-6 text-brand-purple" />;
      case 'Tahun Berdiri':
        return <Calendar className="w-6 h-6 text-brand-teal" />;
      default:
        return <Rocket className="w-6 h-6 text-brand-sky" />;
    }
  };

  const calculatedAge = Math.max(0, 2026 - (summary?.foundedYear || 2016));

  return (
    <section id="ringkasan" className="py-24 relative bg-slate-950 bg-circuit-pattern overflow-hidden">
      
      {/* Visual decorations */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none" />
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal variant="fadeUp">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-cyan">
              Mengenal Lebih Dekat
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
              Profil & Ringkasan Ekstrakurikuler
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="w-16 h-1.5 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full mx-auto mt-4" />
          </ScrollReveal>
        </div>
 
        {/* Numeric Counter Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {[
            { label: "Anggota Aktif", value: membersCount, suffix: "", desc: "Siswa-siswi berbakat" },
            { label: "Prestasi Juara", value: 25, suffix: "+", desc: "Tingkat regional hingga global" },
            { label: "Tahun Berdiri", value: calculatedAge, suffix: " Tahun", desc: "Membina inovator teknologi" },
            { label: "Karya Produk", value: productsCount, suffix: "", desc: "Prototipe siap guna" }
          ].map((stat, index) => (
            <ScrollReveal
              key={index}
              variant="zoomIn"
              delay={index * 0.1}
              className="relative p-6 sm:p-8 rounded-2xl glass-panel text-center hover:border-brand-cyan/40 transition-all duration-300 group overflow-hidden"
            >
              {/* Abs hover glow */}
              <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              <div className="mx-auto w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 mb-4 group-hover:scale-110 transition-transform">
                {getStatIcon(stat.label)}
              </div>
              <p className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </p>
              <h3 className="text-xs font-mono font-semibold text-brand-cyan uppercase tracking-wider mt-1.5">
                {stat.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {stat.desc}
              </p>
            </ScrollReveal>
          ))}
        </div>

        {/* Main Content Layout (Profile & History) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* History Card (Left Column) */}
          <div className="lg:col-span-5 flex">
            <ScrollReveal
              variant="slideRight"
              className="p-8 sm:p-10 rounded-3xl glass-panel border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-brand-cyan to-brand-blue rounded-lg">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">
                    Sejarah & Visi Pendiri
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-light font-sans">
                  {summary.history}
                </p>
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 hover:border-brand-cyan/20 transition-all">
                  <p className="text-xs font-mono font-medium text-brand-cyan uppercase tracking-wide">
                    Slogan Ekstrakurikuler:
                  </p>
                  <p className="text-sm font-semibold italic text-slate-200 mt-1 font-sans">
                    "{summary.philosophy}"
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={onDiscoverProductsClick}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-brand-cyan hover:text-brand-purple transition-colors cursor-pointer group"
                >
                  <span>Lihat produk karya inovatif anggota</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Logo Emblem Card (Center Column) */}
          <div className="lg:col-span-3 flex">
            <ScrollReveal
              variant="zoomIn"
              className="p-6 rounded-3xl glass-panel border-white/10 flex flex-col items-center justify-between text-center overflow-hidden relative group w-full"
            >
              {/* Neon backdrop glow */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-brand-cyan/20 to-transparent blur-xl opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity" />
              
              <div className="space-y-5 relative z-10 w-full">
                <span className="text-[9px] font-mono font-bold text-brand-cyan uppercase tracking-wider block bg-brand-cyan/10 py-1 px-2.5 rounded-full border border-brand-cyan/15 w-max mx-auto">
                  Official Emblem
                </span>
                
                {/* Emblem Image with glowing frame */}
                <div className={`w-28 h-28 mx-auto bg-slate-950 border border-brand-cyan/30 relative overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-brand-cyan/10 flex items-center justify-center ${customLogo ? 'rounded-2xl p-2' : 'rounded-full p-1'}`}>
                  <img
                    src={customLogo || logoEmblem}
                    alt="Official Logo AEROB"
                    className={customLogo ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover rounded-full'}
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-display font-extrabold text-white tracking-wide uppercase leading-tight">
                    AEROB SMAN 1 BDW
                  </h4>
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    Aeromodeling & Robotic Club
                  </p>
                </div>
              </div>

              <div className="w-full pt-4 border-t border-white/5 relative z-10 mt-4">
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-left">
                  <div className="bg-slate-950/50 p-1.5 px-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-500 block">ID UNIT:</span>
                    <span className="text-brand-cyan font-bold">AR03</span>
                  </div>
                  <div className="bg-slate-950/50 p-1.5 px-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-500 block">STATUS:</span>
                    <span className="text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Profile Card (Right Column) */}
          <div className="lg:col-span-4 flex">
            <ScrollReveal
              variant="slideLeft"
              className="p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between w-full"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(139,92,246,0.05) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-white">
                  Profil Ekstrakurikuler
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light font-sans">
                  {summary.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 block mb-0.5">Sekolah:</span>
                    <span className="text-white font-semibold">{summary.school}</span>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 block mb-0.5">Sejak Tahun:</span>
                    <span className="text-white font-semibold">{summary.foundedYear}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-sans">Kurikulum standardisasi industri</span>
                <span className="p-1 px-2.5 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan rounded-full text-[10px] font-mono tracking-wide uppercase font-semibold">
                  Tersertifikasi
                </span>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* Instructors Showcase Section */}
        <div className="border-t border-white/5 pt-16">
          <div className="text-left mb-10 max-w-xl">
            <ScrollReveal variant="fadeUp">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-purple">
                TIM REGENERASI & PEMBINA
              </h3>
              <p className="text-2xl font-display font-extrabold text-white mt-1">
                Didukung Mentor Ahli di Bidangnya
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(summary.instructors || EXTRACURRICULAR_PROFILE.instructors).map((instructor, index) => (
              <ScrollReveal
                key={instructor.id}
                variant="fadeUp"
                delay={index * 0.15}
                className="p-6 rounded-2xl glass-panel flex flex-col sm:flex-row gap-6 hover:border-brand-purple/40 transition-all duration-300 group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-white/10 shrink-0 mx-auto sm:mx-0">
                  <img
                    src={instructor.imageUrl}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div>
                    <h4 className="text-base font-display font-bold text-white group-hover:text-brand-purple transition-colors">
                      {instructor.name}
                    </h4>
                    <p className="text-[11px] font-mono text-brand-cyan font-medium">
                      {instructor.role}
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      Spesialisasi: {instructor.specialty}
                    </p>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal font-light">
                    {instructor.bio}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Master Achievements Small Feed */}
        <div className="mt-16 bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-[10px] font-mono font-bold uppercase text-brand-cyan tracking-widest">
                Prestasi Utama Rekor
              </h4>
              <p className="text-lg font-display font-bold text-white">Championship History</p>
            </div>
            <span className="p-1 px-3 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan rounded-full text-[10px] font-mono uppercase font-semibold">
              Koleksi Piala: {achievements.length}+ Int
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 4).map((ach) => (
              <div
                key={ach.id}
                className="p-4 bg-black/30 rounded-xl border border-white/5 hover:border-brand-cyan/10 transition-all flex items-start gap-3.5 group"
              >
                <div className="p-2 bg-brand-cyan/10 rounded-lg text-brand-cyan shrink-0 mt-0.5 group-hover:bg-brand-cyan/20 transition-colors">
                  <Award className="w-4 h-4 text-brand-cyan" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{ach.title}</span>
                    <span className="p-0.5 px-1.5 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple rounded text-[9px] font-mono">
                      {ach.year}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 font-semibold uppercase">{ach.level} • {ach.rank}</p>
                  <p className="text-xs text-slate-300 leading-tight font-light">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
