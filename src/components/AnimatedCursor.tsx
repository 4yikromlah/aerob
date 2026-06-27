/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Touch detection - disable customs on mobile tablets
    const checkDevice = () => {
      const match = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(match);
      setIsVisible(!match);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Track cursor hover targets (buttons, links, active items)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isPickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') !== null || 
        target.closest('a') !== null ||
        target.getAttribute('role') === 'button';
      setIsHovered(!!isPickable);
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Soft trailing movement logic
  useEffect(() => {
    if (isMobile) return;
    let frameId: number;

    const updateTrail = () => {
      setTrail((prev) => {
        // Linear interpolation: delay rate
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      frameId = requestAnimationFrame(updateTrail);
    };

    frameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(frameId);
  }, [position, isMobile]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Precision Core Point */}
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-brand-cyan rounded-full pointer-events-none z-[99999] -translate-x-[50%] -translate-y-[50%] mix-blend-screen"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />

      {/* Cyber Trailing Ring */}
      <motion.div
        animate={{
          scale: isHovered ? 1.8 : 1,
          borderColor: isHovered ? '#8b5cf6' : '#06b6d4',
          backgroundColor: isHovered ? 'rgba(139, 92, 246, 0.1)' : 'rgba(6, 182, 212, 0)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 w-8 h-8 border border-brand-cyan rounded-full pointer-events-none z-[99998] -translate-x-[50%] -translate-y-[50%] shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        style={{ left: `${trail.x}px`, top: `${trail.y}px` }}
      />
    </>
  );
}
