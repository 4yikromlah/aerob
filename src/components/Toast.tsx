/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getLogStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-slate-950/90 border-green-500/30 text-green-400',
          icon: <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />,
          shd: 'shadow-green-950/20',
          title: 'LOG: SUCCESS',
        };
      case 'error':
        return {
          bg: 'bg-slate-950/90 border-red-500/30 text-red-400',
          icon: <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />,
          shd: 'shadow-red-950/20',
          title: 'LOG: ERROR',
        };
      case 'info':
      default:
        return {
          bg: 'bg-slate-950/90 border-brand-cyan/30 text-brand-cyan',
          icon: <Info className="w-5 h-5 text-brand-cyan shrink-0" />,
          shd: 'shadow-cyan-950/20',
          title: 'LOG: SYSTEM',
        };
    }
  };

  const config = getLogStyle(toast.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md shadow-lg font-mono text-xs flex gap-3 items-start justify-between ${config.bg} ${config.shd}`}
    >
      <div className="flex gap-2.5 items-start">
        {config.icon}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            {config.title}
          </p>
          <p className="leading-relaxed opacity-90">{toast.text}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
