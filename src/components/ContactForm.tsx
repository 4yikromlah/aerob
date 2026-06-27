/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, User, Mail, FileText, MessageSquare, ShieldCheck, MailCheck } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface ContactFormProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export default function ContactForm({ onAddToast }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Siswa / Calon Anggota',
    subject: 'Pendaftaran Anggota Baru',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      onAddToast('Silakan lengkapi semua field formulir!', 'error');
      return;
    }

    setIsSubmitting(true);
    // Simulate API pipeline transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onAddToast('Pesan berhasil terkirim! Tim Admin kami akan membalas via email.', 'success');
      // Reset form save for states
      setFormData({
        name: '',
        email: '',
        role: 'Siswa / Calon Anggota',
        subject: 'Pendaftaran Anggota Baru',
        message: '',
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="kontak" className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0B0F19] to-[#070a13]">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal variant="fadeUp" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Kirim Pesan & Hubungi Kami
            </h2>
            <div className="w-16 h-1.5 bg-brand-cyan rounded-full mx-auto mt-4 mb-4" />
            <p className="text-sm font-sans text-slate-400 font-light">
              Punya pertanyaan mengenai program latihan, sponsorship, sertifikasi kompetensi, atau pendaftaran anggota baru ekstrakurikuler robotika? Tim kami siap menjawab setiap pertanyaan Anda.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Information blocks Column */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal variant="slideRight" delay={150}>
              <div className="p-8 rounded-3xl glass-panel border-white/5 space-y-6">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-brand-cyan leading-none">
                  INFORMASI KANTOR SEKRETARIAT
                </h3>
                <p className="text-xs text-slate-400 font-sans font-light leading-relaxed">
                  Laboratorium Elektronika Dan Otomasi Robotika, Gedung D Lantai 2, Kampus Terpadu SMK/SMA Unggulan Teknologi.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-brand-cyan">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">TIM RECRUITING & HUbMAS</p>
                      <p className="text-xs font-semibold text-slate-200">Siska Amelia / Fadhil M.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-brand-cyan">
                      <MailCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">EMAIL JAWABAN CEPAT</p>
                      <p className="text-xs font-semibold text-slate-200">robotika@sekolah.sch.id</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-3">
                  <p className="text-[10px] font-mono text-brand-purple uppercase tracking-wider font-semibold">
                    JAM PELAYANAN DAN KOMUNITAS
                  </p>
                  <ul className="text-xs text-slate-400 font-sans space-y-1.5 font-light">
                    <li>• Senin sd Kamis : 14.30 - 17.30 (Ekskul)</li>
                    <li>• Sabtu Simulasi Lapang : 09.00 - 14.00 (Simulasi)</li>
                    <li>• Minggu : Libur Nasional (Laboratorium Tutup)</li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Form Interactive Column */}
          <div className="lg:col-span-7">
            <ScrollReveal variant="slideLeft" delay={200}>
              <div className="p-8 sm:p-10 rounded-3xl glass-panel border-white/5 relative">
                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto text-xl">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Formulir Terkirim Berhasil!</h4>
                      <p className="text-xs text-slate-400 font-sans font-light mt-1 max-w-sm mx-auto">
                        Pesan Anda teleh terenkripsi dan diteruskan ke database pembina utama robotika. Anda akan menerima balasan maksimal dalam 2x24 jam kerja.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 px-5 py-2.5 bg-slate-900 text-brand-cyan hover:bg-slate-800 border border-brand-cyan/20 rounded-xl text-xs font-mono cursor-pointer transition-all"
                    >
                      Kirim Pesan Lain
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                          Nama Lengkap *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <User className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="cth. Muhammad Fajar"
                            className="w-full bg-slate-950/60 border border-white/5 focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all font-sans"
                          />
                        </div>
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                          Alamat Email *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="fajar@student.sch.id"
                            className="w-full bg-slate-950/60 border border-white/5 focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Role selection */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                          Status Profil Anda
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full bg-slate-950/90 border border-white/5 focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30 rounded-xl py-3.5 px-4 text-xs text-slate-300 outline-none transition-all cursor-pointer font-sans"
                        >
                          <option value="Siswa / Calon Anggota">Siswa / Calon Anggota</option>
                          <option value="Orang Tua / Wali Siswa">Orang Tua / Wali Siswa</option>
                          <option value="Guru / Staf Sekolah">Guru / Staf Sekolah</option>
                          <option value="Alumni Robotika">Alumni Robotika</option>
                          <option value="Pihak Industri / Sponsor">Pihak Industri / Sponsor</option>
                        </select>
                      </div>

                      {/* Subject select */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                          Topik Pertanyaan
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-slate-950/90 border border-white/5 focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30 rounded-xl py-3.5 px-4 text-xs text-slate-300 outline-none transition-all cursor-pointer font-sans"
                        >
                          <option value="Pendaftaran Anggota Baru">Pendaftaran Anggota Baru</option>
                          <option value="Sponsorship & Kerja Sama">Sponsorship & Kerja Sama</option>
                          <option value="Konsultasi Proyek Robot/IoT">Konsultasi Proyek Robot/IoT</option>
                          <option value="Kunjungan Laboratorium">Kunjungan Laboratorium</option>
                          <option value="Pelayanan Publik & Klinik Servis">Pelayanan Publik & Klinik Servis</option>
                        </select>
                      </div>
                    </div>

                    {/* Message body */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                        Isi Pesan Pertanyaan Anda *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-4 text-slate-500">
                          <MessageSquare className="w-4 h-4" />
                        </span>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          placeholder="Tuliskan isi pesan Anda secara lengkap dan santun disini..."
                          className="w-full bg-slate-950/60 border border-white/5 focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all font-sans resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
                        <span>Sistem Antar-Muka Terenkripsi SSL</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold text-xs rounded-2xl cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-brand-blue/15 transition-all outline-none"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>MENGIRIM...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>KIRIM PESAN SEKARANG</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
