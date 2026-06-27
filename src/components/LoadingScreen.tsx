/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Eye, Zap, Shield, HelpCircle } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const logs = [
    'BOOT STRAP INITIALIZED. VERIFYING CORES...',
    'CONNECTING COMPILER INFRASTRUCTURE...',
    'CALIBRATING 14 OPTOSENSOR ARRAYS (ADC)...',
    'SYNCHRONIZING EMBEDDED GYROSCOPE AND IMU...',
    'INTEGRATING OPENCV REAL-TIME FRAME BUFFERS...',
    'INJECTING TENSORFLOW LITE MODEL DATASETS...',
    'ESTABLISHING WEB INTERCONNECT SECURITY...',
    'ROBOSYSTEMS BOOT SEQUENCE: STABLE. WE ARE LIVE.'
  ];

  useEffect(() => {
    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4; // Randomized increment
        return Math.min(prev + step, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Rotate terminal messages
    if (progress < 100) {
      const logInterval = setInterval(() => {
        setLogIndex((prev) => (prev < logs.length - 1 ? prev + 1 : prev));
      }, 500);
      return () => clearInterval(logInterval);
    } else {
      setLogIndex(logs.length - 1);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 600); // Allow fade out animation
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-[#070a13] z-[9999] flex flex-col items-center justify-center font-mono p-4 text-center select-none overflow-hidden">
      {/* Dynamic Cyber Gradient Pulse Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] animate-pulse-slow" />
      
      {/* Decorative Matrix Grid */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.2]" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Animated Robot Face Vector / Logo */}
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 1 }}
            className="w-32 h-32 relative bg-slate-950/80 rounded-3xl border border-brand-cyan/20 flex items-center justify-center p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
          >
            {/* Robot Chassis Base */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-brand-cyan fill-none stroke-current stroke-2">
              {/* Outer Head Chassis */}
              <rect x="15" y="25" width="70" height="55" rx="15" className="stroke-[2.5]" />
              {/* Antenna */}
              <line x1="50" y1="25" x2="50" y2="10" className="stroke-[3]" />
              <circle cx="50" cy="8" r="4" className="fill-brand-purple stroke-none animate-ping" />
              <circle cx="50" cy="8" r="4" className="fill-brand-cyan" />
              {/* Neck Joint */}
              <rect x="42" y="80" width="16" height="10" rx="3" className="fill-slate-900" />
              {/* Ears */}
              <rect x="8" y="42" width="7" height="20" rx="2" className="fill-brand-cyan/30" />
              <rect x="85" y="42" width="7" height="20" rx="2" className="fill-brand-cyan/30" />
              
              {/* Animated Glowing Screen For Eyes */}
              <rect x="25" y="38" width="50" height="24" rx="8" className="fill-slate-950 border border-brand-cyan/20" />
            </svg>

            {/* Glowing Eyes */}
            <div className="absolute top-[54px] w-[50px] flex justify-between px-3">
              <motion.div
                animate={{
                  scaleY: [1, 1, 0.1, 1, 1],
                  scaleX: [1, 1.2, 1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  repeatDelay: 2,
                }}
                className="w-3 h-3 bg-brand-cyan rounded-full shadow-[0_0_10px_#06b6d4]"
              />
              <motion.div
                animate={{
                  scaleY: [1, 1, 0.1, 1, 1],
                  scaleX: [1, 1.2, 1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  repeatDelay: 2,
                }}
                className="w-3 h-3 bg-brand-cyan rounded-full shadow-[0_0_10px_#06b6d4]"
              />
            </div>

            {/* Simulated Mouth Equalizer */}
            <div className="absolute bottom-[28px] flex items-center gap-0.5 justify-center">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [4, Math.random() * 12 + 6, 4],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + i * 0.1,
                    ease: 'easeInOut',
                  }}
                  className="w-1 bg-brand-purple rounded-full"
                />
              ))}
            </div>

            {/* Cyber Corner brackets */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-brand-cyan/40" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-brand-cyan/40" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-brand-cyan/40" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-brand-cyan/40" />
          </motion.div>
        </div>

        {/* Progress Text */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between text-xs px-2 text-slate-400 font-semibold"
          >
            <span className="text-brand-cyan flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 animate-spin-slow text-brand-purple" />
              SYSTEM BOOT: DEEPLAYOUT
            </span>
            <span className="text-brand-purple">{progress}% COMPLETE</span>
          </motion.div>

          {/* Progress Bar Container */}
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 relative p-0.5">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-brand-blue via-brand-cyan to-[#c084fc] rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Virtual System Terminal Logs Logger Console */}
        <div className="bg-slate-950/95 p-4 rounded-2xl border border-white/5 text-left h-28 flex flex-col justify-end text-[10px] leading-relaxed relative overflow-hidden">
          <div className="absolute top-2 right-3 font-mono text-[8px] text-zinc-600 select-none">
            SYS CONSOLE v4.11
          </div>
          <div className="space-y-1.5 overflow-hidden">
            {progress < 100 ? (
              <>
                <p className="text-[#a855f7]/60 line-clamp-1">{`> ${logs[Math.max(0, logIndex - 2)] || '...'}`}</p>
                <p className="text-brand-cyan/80 line-clamp-1">{`> ${logs[Math.max(0, logIndex - 1)] || '...'}`}</p>
                <p className="text-white animate-pulse line-clamp-1 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block shrink-0 animate-ping" />
                  {`> ${logs[logIndex]}`}
                </p>
              </>
            ) : (
              <div className="space-y-1 text-center py-2">
                <p className="text-green-400 font-bold tracking-widest text-xs">
                  BOOSTRAPPING SUCCESS
                </p>
                <p className="text-slate-400 text-[9px] uppercase tracking-wide">
                  REDIRECTING TO THE ROBOTICS SECURE MAIN SYSTEM...
                </p>
              </div>
            )}
          </div>
          {/* Scanline indicator effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/3 to-transparent opacity-30 h-1/2 select-none animate-bounce" />
        </div>
      </div>
    </div>
  );
}
