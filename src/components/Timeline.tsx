/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Target, Calendar, Radio, Globe, Medal } from 'lucide-react';
import { GENERAL_ACHIEVEMENTS } from '../data/roboticsData';
import ScrollReveal from './ScrollReveal';

interface TimelineProps {
  achievements?: any[];
}

export default function Timeline({ achievements }: TimelineProps) {
  const [filterLevel, setFilterLevel] = useState<'All' | 'Nasional' | 'Internasional' | 'Regional'>('All');

  const listToFilter = achievements || GENERAL_ACHIEVEMENTS;

  const filteredAchievements = listToFilter.filter((item) => {
    if (filterLevel === 'All') return true;
    return item.level === filterLevel;
  });

  return (
    <section id="prestasi" className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0B0F19] to-[#070a13]">
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal variant="fadeUp" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Prestasi & Milestone Kronologi
            </h2>
            <div className="w-16 h-1.5 bg-brand-cyan rounded-full mx-auto mt-4 mb-4" />
            <p className="text-sm font-sans text-slate-400 font-light">
              Menyusuri rekam jejak perjuangan, inovasi sirkuit otonom, dan dominasi kompetisi robotika yang berhasil dipersembahkan siswa-siswi dari tingkat regional hingga internasional.
            </p>

            {/* Filter controls */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {(['All', 'Internasional', 'Nasional', 'Regional'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wide cursor-pointer border transition-all ${
                    filterLevel === level
                      ? 'bg-brand-cyan/15 border-brand-cyan text-brand-cyan'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {level === 'All' ? 'SEMUA TINGKAT' : level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Tree Timeline */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            [Data milestone kosong untuk filter terpilih]
          </div>
        ) : (
          <div className="relative border-l border-white/5 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:h-full md:before:w-0.5 md:before:bg-white/5 space-y-12 md:space-y-0 md:pt-4">
            {filteredAchievements.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`relative md:grid md:grid-cols-2 md:gap-8 items-center ${
                    isEven ? 'md:text-right' : 'md:text-left'
                  }`}
                >
                  {/* Circle Badge Connector */}
                  <div className="absolute left-[-16px] md:left-1/2 md:translate-x-[-50%] top-0 w-8 h-8 rounded-full bg-slate-950 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-lg shadow-brand-cyan/20 z-10">
                    <Medal className="w-4 h-4 text-brand-cyan" />
                  </div>

                  {/* Left Column contents if isEven, otherwise empty */}
                  <div className={`${isEven ? 'md:col-start-1 md:pr-12' : 'md:col-start-2 md:pl-12'} md:block pl-6`}>
                    <ScrollReveal variant={isEven ? 'slideRight' : 'slideLeft'} delay={100 + idx * 50}>
                      <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/5 hover:border-brand-cyan/20 transition-all duration-300 shadow-md">
                        
                        {/* Year + level badge */}
                        <div className={`flex items-center gap-2 mb-3 flex-wrap ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-brand-purple bg-brand-purple/10 border border-brand-purple/20 rounded px-2.5 py-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {item.year}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 rounded px-2.5 py-0.5">
                            {item.level.toUpperCase()}
                          </span>
                        </div>

                        {/* Title & Rank */}
                        <h3 className="text-sm font-bold text-white tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-xs font-semibold text-brand-cyan mt-1 font-mono">
                          {item.rank}
                        </p>

                        {/* Description */}
                        <p className="text-xs text-slate-400 font-sans font-light mt-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  </div>

                  {/* Spacer for secondary alignment */}
                  <div className="hidden md:block" />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
