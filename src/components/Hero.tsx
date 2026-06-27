/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, ClipboardEdit, Cpu, Zap, Radio, Terminal, Settings } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onJoinClick, onExploreClick }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ledBlinking, setLedBlinking] = useState(true);
  const [powerOn, setPowerOn] = useState(true);
  const [sensorDist, setSensorDist] = useState(25);
  
  // Parallax physical state
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Typing Text Animation
  const typingPhrases = [
    "Autonomous Mobile Robots",
    "Internet of Things (IoT)",
    "Artificial Intelligence (AI)",
    "Drone Waypoint Aviation"
  ];
  const [textIndex, setTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = typingPhrases[textIndex];
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setIsDeleting(true);
          setTypingSpeed(1500); // Stay completed for 1.5 seconds
        } else {
          setTypingSpeed(100);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % typingPhrases.length);
          setTypingSpeed(500);
        } else {
          setTypingSpeed(45);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, textIndex, typingSpeed]);

  // Handle Parallax mousemove
  useEffect(() => {
    const handleMouseParallax = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      // Subtle multipliers: max 20px offset
      setParallaxOffset({ x: x * 15, y: y * 15 });
    };
    window.addEventListener('mousemove', handleMouseParallax);
    return () => window.removeEventListener('mousemove', handleMouseParallax);
  }, []);

  // Background interactive network system on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    const particleCount = Math.min(65, Math.floor(width / 20));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.3)',
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw cybernet grid mesh
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render and connect nodes
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Attract a bit to mouse
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 150) {
          p.x += (dx / distToMouse) * 0.6;
          p.y += (dy / distToMouse) * 0.6;
        }

        // Render point
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect near nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distDx = p.x - p2.x;
          const distDy = p.y - p2.y;
          const dist = Math.sqrt(distDx * distDx + distDy * distDy);

          if (dist < 100) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Micro-controller simulator ticker
  useEffect(() => {
    if (!ledBlinking || !powerOn) return;
    const interval = setInterval(() => {
      setLedBlinking((b) => !b);
    }, 700);
    return () => clearInterval(interval);
  }, [ledBlinking, powerOn]);

  // Simulated ultrasonic radar sweeping value
  useEffect(() => {
    if (!powerOn) return;
    const interval = setInterval(() => {
      setSensorDist((d) => {
        const offset = Math.floor(Math.random() * 5) - 2;
        const val = d + offset;
        return val < 5 ? 5 : val > 95 ? 95 : val;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [powerOn]);

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Interactive Network Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />

      {/* Cyber Glowing Orbs with Parallax Effect */}
      <motion.div 
        style={{ x: parallaxOffset.x * -0.5, y: parallaxOffset.y * -0.5 }}
        className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        style={{ x: parallaxOffset.x * 0.4, y: parallaxOffset.y * 0.4 }}
        className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-brand-cyan/10 rounded-full blur-[140px] pointer-events-none" 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-brand-purple/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Dynamic Animated Gradient Background bar */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 via-transparent to-brand-purple/5 opacity-40 animate-pulse-slow pointer-events-none" />

      {/* Futuristic Grid Overlay lines */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-brand-navy to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Headline and CTAs (Left Column) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Tagline / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue/10 border border-brand-blue/30 rounded-full text-[11px] font-mono font-medium tracking-wide text-brand-cyan uppercase animate-pulse mx-auto lg:mx-0">
              <Radio className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Sistem Generasi AI & Otomasi 5.0</span>
            </div>

            {/* Giant Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.1] sm:leading-[1.15]">
                Sistem Informasi Manajemen Ekstrakurikuler{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-purple glow-cyan">
                  ROBOTIKA
                </span>
              </h1>

              {/* Typing Animated Headline */}
              <div className="h-8 md:h-10 flex items-center justify-center lg:justify-start">
                <span className="text-sm md:text-base font-mono text-slate-400">fokus_kajian: </span>
                <span className="text-sm md:text-base font-mono font-semibold text-brand-cyan ml-2">
                  {currentText}
                </span>
                <span className="w-1.5 h-4 md:h-5 bg-brand-cyan ml-1 animate-pulse" />
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-sans font-light leading-relaxed">
                Mewujudkan generasi kreatif, inovatif, dan berdaya saing global melalui perancangan cerdas, pemrograman mikrokontroler, dan riset robotika terapan.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue text-white font-semibold text-sm rounded-2xl cursor-pointer flex items-center justify-center gap-2.5 shadow-lg shadow-brand-blue/20 hover:shadow-brand-cyan/40 scale-100 hover:scale-[1.03] active:scale-95 transition-all duration-300"
              >
                <Play className="w-4 h-4 fill-current text-white" />
                <span>Jelajahi Program</span>
              </button>

              <button
                onClick={onJoinClick}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800/80 text-brand-cyan font-semibold text-sm rounded-2xl border border-brand-cyan/30 flex items-center justify-center gap-2.5 cursor-pointer hover:border-brand-cyan hover:shadow-md hover:shadow-brand-cyan/10 transition-all duration-300"
              >
                <ClipboardEdit className="w-4 h-4" />
                <span>Daftar Anggota</span>
              </button>
            </div>

            {/* Features small bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 border-t border-white/5 font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Cpu className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>Basic IoT</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Settings className="w-4 h-4 text-brand-purple shrink-0" />
                <span>Mechanical</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Terminal className="w-4 h-4 text-brand-teal shrink-0" />
                <span>ROS Coding</span>
              </div>
            </div>
          </div>

          {/* Interactive Microcontroller Simulator Box (Right Column) with Mouse Parallax offset */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              style={{ x: parallaxOffset.x, y: parallaxOffset.y }}
              className="relative w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl border-white/10 overflow-hidden"
              animate={{
                boxShadow: powerOn
                  ? '0 25px 60px -15px rgba(6, 182, 212, 0.25)'
                  : '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Copper Circuit Path Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-brand-cyan/10 rounded-tr-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-brand-purple/10 rounded-bl-3xl pointer-events-none" />

              {/* Hardware module visual design (Arduino/ESP32 hybrid mockup) */}
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${powerOn ? 'bg-green-400 animate-ping' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      ROBO-BOARD V3.0
                    </span>
                  </div>
                  {/* Power Button */}
                  <button
                    onClick={() => setPowerOn((p) => !p)}
                    className={`px-3 py-1 rounded-full font-mono text-[9px] font-semibold border cursor-pointer transition-all ${
                      powerOn
                        ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/40 hover:bg-brand-cyan/30 animate-pulse'
                        : 'bg-slate-800 text-slate-500 border-white/5 hover:bg-slate-700'
                    }`}
                  >
                    POWER: {powerOn ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Simulated OLED Display */}
                <div className="w-full bg-black/90 p-4 rounded-xl border border-white/10 font-mono text-xs text-brand-cyan space-y-2 box-border min-h-[110px]">
                  {powerOn ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between border-b border-white/10 pb-1 text-[10px] text-slate-400">
                        <span>SYSTEM MODULES: LIVE</span>
                        <span className="text-green-400">98% STABLE</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">MCU Temp:</span>
                        <span className="text-white">34.2 °C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Radar Range:</span>
                        <span className={`font-semibold ${sensorDist < 20 ? 'text-red-400 animate-pulse' : 'text-brand-cyan'}`}>
                          {sensorDist} cm {sensorDist < 20 && '[DANGER]'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-brand-purple mt-2">
                        <Radio className="w-3 h-3 text-brand-purple" />
                        <span>BLE Broadcasting: OK</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-slate-600 h-full flex flex-col items-center justify-center text-center py-4">
                      <span>MCU SHUTDOWN</span>
                      <span className="text-[9px] mt-1">Sistem Non-Aktif</span>
                    </div>
                  )}
                </div>

                {/* Circuit Components Schema */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-3 font-mono text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" /> LED 13 Pin (Blink)
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-sm transition-colors duration-100 ${
                        powerOn && ledBlinking ? 'bg-orange-500 shadow-lg shadow-orange-500/60' : 'bg-slate-800'
                      }`}
                    />
                  </div>
                  
                  {/* Interactive Micro Servo Angle slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Servo Motor SG90:</span>
                      <span className="text-white font-semibold">
                        {powerOn ? `${Math.round(sensorDist * 1.8)}°` : '0°'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                      <motion.div
                        className="bg-brand-purple h-full"
                        animate={{ width: powerOn ? `${sensorDist}%` : '0%' }}
                        transition={{ type: 'spring', stiffness: 100 }}
                      />
                    </div>
                  </div>

                  {/* ESP32 Chip graphic illustration */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 px-1.5 bg-brand-blue/20 rounded border border-brand-blue/40 text-[9px] text-brand-sky font-semibold font-mono">
                        ESP32
                      </div>
                      <span className="text-[9px] text-slate-500">Wi-Fi Dual Band SoC</span>
                    </div>
                    <span className="text-[9px] text-green-400 font-semibold uppercase">Dual Core</span>
                  </div>
                </div>

                {/* Interaction Instruction */}
                <p className="text-[10px] font-mono text-slate-400 text-center italic">
                  *Klik tombol POWER untuk menyalakan sirkuit simulator.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
