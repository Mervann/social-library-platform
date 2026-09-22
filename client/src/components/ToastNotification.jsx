import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const toastConfig = {
  success: {
    icon: CheckCircle2,
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-950/80',
    iconColor: 'text-emerald-400',
    progressBg: 'bg-emerald-500',
    glow: 'shadow-emerald-900/30'
  },
  error: {
    icon: XCircle,
    border: 'border-rose-500/40',
    bg: 'bg-rose-950/80',
    iconColor: 'text-rose-400',
    progressBg: 'bg-rose-500',
    glow: 'shadow-rose-900/30'
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-amber-500/40',
    bg: 'bg-amber-950/80',
    iconColor: 'text-amber-400',
    progressBg: 'bg-amber-500',
    glow: 'shadow-amber-900/30'
  },
  info: {
    icon: Info,
    border: 'border-sky-500/40',
    bg: 'bg-sky-950/80',
    iconColor: 'text-sky-400',
    progressBg: 'bg-sky-500',
    glow: 'shadow-sky-900/30'
  }
};

export const ToastItem = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);
  const config = toastConfig[toast.type] || toastConfig.info;
  const IconComponent = config.icon;

  useEffect(() => {
    const duration = toast.duration || 4000;
    const intervalTime = 40;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onClose(toast.id);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast, onClose]);

  return (
    <div
      className={`relative flex items-start gap-3 w-80 max-w-sm p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 ${config.bg} ${config.border} ${config.glow}`}
      style={{
        animation: 'slideIn 0.3s ease-out forwards'
      }}
    >
      <IconComponent className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconColor}`} />
      
      <div className="flex-1 pr-2">
        {toast.title && <h4 className="text-sm font-semibold text-white mb-0.5">{toast.title}</h4>}
        <p className="text-xs text-gray-200 leading-relaxed font-medium">{toast.message}</p>
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Animated progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 overflow-hidden rounded-b-xl">
        <div
          className={`h-full transition-all ease-linear ${config.progressBg}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};
