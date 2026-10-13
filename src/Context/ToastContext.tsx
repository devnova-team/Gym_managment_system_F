import React, { createContext, useContext, useState, useCallback } from 'react';
import { RiCheckLine, RiInformationLine, RiAlertLine, RiErrorWarningLine, RiCloseLine } from 'react-icons/ri';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const hideToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(({ type = 'success', message, duration = 3500 }) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newToast = { id, type, message };

        setToasts((prev) => [...prev.slice(-2), newToast]);

        if (duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }

        return id;
    }, [hideToast]);

    const toast = {
        success: (message, duration) => showToast({ type: 'success', message, duration }),
        error: (message, duration) => showToast({ type: 'error', message, duration }),
        info: (message, duration) => showToast({ type: 'info', message, duration }),
        warning: (message, duration) => showToast({ type: 'warning', message, duration }),
        hide: hideToast,
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast, toast }}>
            {children}
            {/* Global Toaster Container with RTL/LTR responsive positioning */}
            <div className="fixed bottom-6 inset-e-6 z-9999 flex flex-col gap-2.5 max-w-sm pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border transition-all duration-300 transform translate-y-0 opacity-100 ${
                            t.type === 'success'
                                ? 'bg-slate-900/95 dark:bg-[#0e1517]/95 text-white border-[#85F40F]/40 shadow-[0_10px_30px_rgba(133,244,15,0.15)]'
                                : t.type === 'error'
                                ? 'bg-slate-900/95 dark:bg-[#0e1517]/95 text-white border-rose-500/40 shadow-[0_10px_30px_rgba(244,63,94,0.15)]'
                                : t.type === 'warning'
                                ? 'bg-slate-900/95 dark:bg-[#0e1517]/95 text-white border-amber-500/40 shadow-[0_10px_30px_rgba(245,158,11,0.15)]'
                                : 'bg-slate-900/95 dark:bg-[#0e1517]/95 text-white border-sky-500/40 shadow-[0_10px_30px_rgba(56,189,248,0.15)]'
                        } backdrop-blur-md`}
                    >
                        <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                t.type === 'success'
                                    ? 'bg-[#85F40F]/20 text-[#85F40F]'
                                    : t.type === 'error'
                                    ? 'bg-rose-500/20 text-rose-400'
                                    : t.type === 'warning'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-sky-500/20 text-sky-400'
                            }`}
                        >
                            {t.type === 'success' && <RiCheckLine size={18} />}
                            {t.type === 'error' && <RiErrorWarningLine size={18} />}
                            {t.type === 'warning' && <RiAlertLine size={18} />}
                            {t.type === 'info' && <RiInformationLine size={18} />}
                        </div>
                        <span className="text-xs font-bold leading-relaxed flex-1">{t.message}</span>
                        <button
                            type="button"
                            onClick={() => hideToast(t.id)}
                            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <RiCloseLine size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastContext;