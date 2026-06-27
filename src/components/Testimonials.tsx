/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight, GraduationCap, Award } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface TestimonyItem {
  id: string;
  name: string;
  gradYear: string;
  currentRole: string;
  text: string;
  imageUrl: string;
  achievement: string;
}

export default function Testimonials() {
  const testimonies: TestimonyItem[] = [
    {
      id: 't1',
      name: 'Budi Hartono, S.Kom.',
      gradYear: 'Alumni 2021',
      currentRole: 'Senior Embedded Engineer di Telkom Indonesia',
      text: 'Gabung ekskul robotika adalah titik balik kehidupan sekolah saya. Saya belajar ESP32, solder papan PCB, dan pemrograman C++ dari nol. Portofolio proyek otonom buatan saya di lab berhasil mengamankan beasiswa universitas penuh serta membawa saya cepat diserap oleh industri telekomunikasi.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      achievement: 'Peraih Gold Medal NRO 2020'
    },
    {
      id: 't2',
      name: 'Linda Safitri',
      gradYear: 'Alumni 2023',
      currentRole: 'Mahasiswi Teknik Elektro & Komputer ITS',
      text: 'Pelajaran machine learning dan computer vision menggunakan Raspberry Pi di Divisi AI sangat membantu perkuliahan saya. Ketika mahasiswa baru beradaptasi pada pemrograman dasar, saya sudah mahir melakukan tracking warna dan klasifikasi sensor berkat bekal berharga dari pembina robotika sekolah.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      achievement: 'Best Innovator Challenge Singapore'
    },
    {
      id: 't3',
      name: 'Yusuf Firdaus',
      gradYear: 'Alumni 2020',
      currentRole: 'Founder & CEO Robotech IoT Solution',
      text: 'Selain teknik rekayasa, kami dididik berwirausaha secara mendalam di bidang industri otonom. Pelayanan pembuatan prototype dan konsultasi sasis industri mengajarkan kami arti mematangkan karya kreatif. Saat ini startup IoT kami telah mempekerjakan belasan engineer muda berbakat.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      achievement: 'Ketua Divisi Robotika 2019'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev < testimonies.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : testimonies.length - 1));
  };

  const current = testimonies[activeIndex];

  return (
    <section id="testimoni" className="py-20 relative overflow-hidden bg-[#070a13]">
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal variant="fadeUp" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Testimoni Alumni & Kisah Sukses
            </h2>
            <div className="w-16 h-1.5 bg-brand-cyan rounded-full mx-auto mt-4 mb-4" />
            <p className="text-sm font-sans text-slate-400 font-light">
              Melihat dedikasi yang tinggi, alumni kami telah tersebar di berbagai universitas teknologi ternama serta aktif merintis karir profesional dan startup di bidang rekayasa cerdas.
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto">
          <ScrollReveal variant="zoomIn" delay={200}>
            <div className="relative bg-slate-950/80 rounded-3xl border border-white/5 p-8 sm:p-12 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
              {/* Giant quote background logo */}
              <div className="absolute top-8 right-8 text-neutral-900 select-none pointer-events-none z-0">
                <Quote className="w-40 h-40 opacity-15 stroke-[1.5]" />
              </div>

              {/* Slider content wrapper */}
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 0.98, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98, x: -20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                  >
                    {/* Image Column */}
                    <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        <img
                          src={current.imageUrl}
                          alt={current.name}
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-brand-cyan/30 shadow-lg shadow-brand-cyan/5"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-brand-cyan p-1.5 rounded-lg border border-slate-950 text-slate-950">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                          {current.name}
                        </h4>
                        <span className="text-[10px] font-mono text-brand-cyan font-semibold block uppercase mt-0.5">
                          {current.gradYear}
                        </span>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-2 bg-slate-900 border border-brand-purple/20 rounded-full text-[9px] font-mono text-brand-purple">
                          <Award className="w-3 h-3" />
                          <span>{current.achievement}</span>
                        </div>
                      </div>
                    </div>

                    {/* Testimony content */}
                    <div className="md:col-span-8 space-y-4 text-center md:text-left self-center">
                      <Quote className="w-8 h-8 text-brand-cyan opacity-40 shrink-0 mx-auto md:mx-0" />
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed font-light italic">
                        "{current.text}"
                      </p>
                      <div className="border-t border-white/5 pt-4">
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">STATUS KARIER SAAT INI:</p>
                        <p className="text-xs font-semibold text-slate-200 mt-0.5">{current.currentRole}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5 relative z-10 flex-row">
                {/* Micro circle status indices */}
                <div className="flex gap-2">
                  {testimonies.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1.5 rounded-full cursor-pointer transition-all ${
                        activeIndex === i ? 'w-6 bg-brand-cyan' : 'w-1.5 bg-slate-800'
                      }`}
                      aria-label={`Go to slide ${i+1}`}
                    />
                  ))}
                </div>

                {/* Arrow Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    id="testimoni-prev"
                    className="p-2 bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:border-brand-cyan/20 rounded-xl cursor-pointer transition-all active:scale-95"
                    aria-label="Slide sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    id="testimoni-next"
                    className="p-2 bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:border-brand-cyan/20 rounded-xl cursor-pointer transition-all active:scale-95"
                    aria-label="Slide selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
