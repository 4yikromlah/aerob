/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Eye, Rocket, CheckCircle2, ChevronRight, Binary, Network, Shield } from 'lucide-react';

interface VisiMisiProps {
  visiMisi?: {
    vision: string;
    missions: { id: number; title: string; desc: string; icon?: string }[];
  };
}

export default function VisiMisi({ visiMisi }: VisiMisiProps) {
  const defaultMissions = [
    {
      id: 1,
      title: "Pendidikan Sistematis & Terpadu",
      desc: "Menyelenggarakan kurikulum pelatihan terstruktur di bidang elektronika, mekanikal, pemrograman C++/Python, dan kecerdasan buatan berbasis proyek nyata.",
      icon: "Binary"
    },
    {
      id: 2,
      title: "Riset Teknologi Terapan Solutif",
      desc: "Mendorong integrasi ide kreatif siswa dalam merancang robot otonom dan instrumen pintar untuk memecahkan problematika hidup sehari-hari dan industri.",
      icon: "Network"
    },
    {
      id: 3,
      title: "Kemitraan & Kolaborasi Global",
      desc: "Membangun kerja sama yang produktif dengan startup kecerdasan buatan, universitas teknologi, pabrik otomasi, dan komunitas pembuat lintas instansi.",
      icon: "CheckCircle2"
    },
    {
      id: 4,
      title: "Kompetisi Berprestasi & Bermartabat",
      desc: "Mengirimkan representasi delegasi terbaik secara teratur dalam kejuaraan robotika sains dari level regional, nasional, hingga kejuaraan prestisius internasional.",
      icon: "ChevronRight"
    },
    {
      id: 5,
      title: "Pengabdian Sosial IPTEK",
      desc: "Menyelenggarakan klinik pelayanan masyarakat, servis peralatan, serta mengedukasi siswa sekolah dasar/menengah pertama untuk melebarkan literasi teknologi.",
      icon: "Shield"
    }
  ];

  const currentVision = visiMisi?.vision || "Menjadi pusat inkubasi inovasi robotika tingkat sekolah menengah terdepan di Indonesia yang mencetak talenta pembuat (creators) berkarakter islami, berintegritas, berjiwa inovator teknologi, serta terampil mengotomasi kecerdasan buatan untuk kemaslahatan masyarakat global.";
  const currentMissions = visiMisi?.missions || defaultMissions;

  const getIcon = (iconName: string | undefined, idx: number) => {
    switch (iconName) {
      case 'Binary': return <Binary className="w-4 h-4 text-brand-cyan" />;
      case 'Network': return <Network className="w-4 h-4 text-brand-purple" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4 text-brand-teal" />;
      case 'ChevronRight': return <ChevronRight className="w-4 h-4 text-brand-sky" />;
      case 'Shield': return <Shield className="w-4 h-4 text-brand-blue" />;
      default:
        const colors = ["text-brand-cyan", "text-brand-purple", "text-brand-teal", "text-brand-sky", "text-brand-blue"];
        const colorClass = colors[idx % colors.length];
        return <CheckCircle2 className={`w-4 h-4 ${colorClass}`} />;
    }
  };

  return (
    <section id="vision" className="py-24 relative bg-slate-900 overflow-hidden">
      
      {/* Decorative Circuit Paths & Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Structural SVG Grid lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal variant="fadeUp">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-cyan">
              Filosofi Pergerakan
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
              Visi & Misi ROBOTIKA
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="w-16 h-1.5 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full mx-auto mt-4" />
          </ScrollReveal>
        </div>

        {/* Vision & Mission Double layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Vision card (Left side) */}
          <div className="lg:col-span-5">
            <ScrollReveal variant="slideRight" duration={0.8} className="h-full">
              <div 
                className="p-8 sm:p-10 rounded-3xl relative overflow-hidden h-full flex flex-col justify-between"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(37,99,235,0.02) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  boxShadow: '0 20px 50px -15px rgba(139, 92, 246, 0.15)'
                }}
              >
                {/* Circuit Grid node ornament */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-purple/20 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div className="w-14 h-14 bg-brand-purple/20 rounded-2xl flex items-center justify-center border border-brand-purple/40 shadow-inner group">
                    <Eye className="w-7 h-7 text-brand-purple animate-pulse" />
                  </div>
                  
                  <h3 className="text-2xl font-display font-extrabold text-white">
                    Visi Utama Kami
                  </h3>
                  
                  <p className="text-sm text-slate-200 leading-relaxed font-light">
                    "{currentVision}"
                  </p>
                </div>

                <div className="pt-8 mt-8 border-t border-white/5 space-y-4 text-xs font-mono">
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-brand-purple" />
                    <span>Inkubasi Ide & Prototype Cepat</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                    <span>Pola Pikir Problem Solving Global</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Mission card (Right side) */}
          <div className="lg:col-span-7">
            <ScrollReveal variant="slideLeft" duration={0.8}>
              <div className="p-8 sm:p-10 rounded-3xl glass-panel border-white/10 space-y-8 relative">
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-cyan/15 rounded-2xl flex items-center justify-center border border-brand-cyan/30">
                    <Rocket className="w-7 h-7 text-brand-cyan" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-extrabold text-white">
                      Misi Pengembangan
                    </h3>
                    <p className="text-xs font-mono text-brand-cyan mt-0.5">Langkah Kerja Strategis</p>
                  </div>
                </div>

                {/* List items */}
                <div className="space-y-6">
                  {currentMissions.map((mission, idx) => (
                    <div 
                      key={mission.id} 
                      className="flex gap-4 items-start p-4 hover:bg-white/3 font-sans rounded-2xl border border-transparent hover:border-white/5 transition-all duration-300 group"
                    >
                      <div className="p-2 bg-slate-900 rounded-lg border border-white/5 group-hover:border-brand-cyan/35 transition-colors shrink-0 mt-1">
                        {getIcon(mission.icon, idx)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-cyan transition-colors">
                          {idx + 1}. {mission.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-light">
                          {mission.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
