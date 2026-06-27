/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { PROGRAMS_DATA } from '../data/roboticsData';
import { Program } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Maximize, 
  Dribbble, 
  Wifi, 
  Cpu, 
  Workflow, 
  Eye, 
  Navigation, 
  Layers, 
  BookOpen, 
  Clock, 
  BarChart, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ProgramsProps {
  programs?: Program[];
}

export default function Programs({ programs }: ProgramsProps) {
  const currentPrograms = programs || PROGRAMS_DATA;
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const getIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-brand-cyan group-hover:text-white transition-colors" };
    switch (iconName) {
      case 'Maximize':
        return <Maximize {...props} />;
      case 'Dribbble':
        return <Dribbble {...props} />;
      case 'Wifi':
        return <Wifi {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Workflow':
        return <Workflow {...props} />;
      case 'Eye':
        return <Eye {...props} />;
      case 'Navigation':
        return <Navigation {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Pemula':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Menengah':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Mahir':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <section id="programs" className="py-24 relative bg-slate-950 overflow-hidden">
      
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal variant="fadeUp">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-cyan">
              Kurikulum Pelatihan Sasis & Logika
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
              Program Unggulan Pemelajaran
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="w-16 h-1.5 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full mx-auto mt-4" />
          </ScrollReveal>
        </div>

        {/* Categories Grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPrograms.map((prog, index) => (
            <ScrollReveal
              key={prog.id}
              variant="zoomIn"
              delay={index * 0.08}
              className="group flex"
            >
              <div 
                className="p-6 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between w-full border-white/5 hover:border-brand-cyan/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-brand-cyan/10"
                onClick={() => setSelectedProgram(prog)}
              >
                {/* Micro corner highlight */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  {/* Icon Block */}
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-brand-cyan group-hover:border-brand-cyan transition-all duration-300">
                    {getIcon(prog.iconName)}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-display font-bold text-white group-hover:text-brand-cyan transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-light">
                      {prog.description}
                    </p>
                  </div>
                </div>

                {/* Meta details footer */}
                <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border font-semibold ${getDifficultyColor(prog.difficulty)}`}>
                      {prog.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
                      <Clock className="w-3 h-3 text-brand-teal" />
                      <span>{prog.duration}</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-cyan group-hover:text-brand-purple flex items-center gap-0.5 transition-colors font-semibold">
                    <span>Silabus</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>

      {/* Syllabus Modal/Drawer */}
      <AnimatePresence>
        {selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setSelectedProgram(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border-white/10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6"
            >
               {/* Close Button */}
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 p-1.5 bg-slate-900 rounded-full border border-white/10 text-slate-400 hover:text-white cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {selectedProgram.imageUrl && (
                <div className="w-full h-40 rounded-2xl overflow-hidden border border-white/14 relative">
                  <img
                    src={selectedProgram.imageUrl}
                    alt={selectedProgram.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan rounded-2xl">
                  {getIcon(selectedProgram.iconName)}
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono border font-semibold uppercase ${getDifficultyColor(selectedProgram.difficulty)}`}>
                    Divisi: {selectedProgram.difficulty}
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-white mt-1">
                    {selectedProgram.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider">
                    Garis Besar Program
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {selectedProgram.description}
                  </p>
                </div>

                <div className="p-5 bg-slate-900/80 rounded-2xl border border-white/5 space-y-3.5">
                  <h4 className="text-xs font-mono font-bold text-brand-purple uppercase tracking-wider flex items-center gap-11.5">
                    <BookOpen className="w-4 h-4 text-brand-purple" /> Materi Silabus Modul:
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-light">
                    {selectedProgram.detailedInfo}
                  </p>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-teal" />
                    <div>
                      <span className="text-slate-400 block text-[9px]">Masa Belajar:</span>
                      <span className="text-white font-semibold">{selectedProgram.duration}</span>
                    </div>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                    <div>
                      <span className="text-slate-400 block text-[9px]">Sertifikasi:</span>
                      <span className="text-white font-semibold">Uji Portofolio</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="w-full py-2.5 bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan text-xs font-semibold rounded-xl cursor-pointer transition-all border border-brand-cyan/30"
                >
                  Selesai Membaca Silabus
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
