
import React from 'react';
import { Alert } from '../types';
import { MobileIcon, XCircleIcon, LinkedinIcon, MailIcon, BrainIcon } from './Icons';

interface NotificationToastProps {
  alert: Alert | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300 fade-in pointer-events-auto">
        {/* Mobile System Notification Design */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-3xl p-4 w-[360px] flex flex-col relative overflow-hidden ring-1 ring-black/5">
            
            {/* Header / App Identity */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 rounded-md p-1">
                         <MobileIcon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[12px] font-semibold text-slate-700 tracking-wide">LINKGEN • Now</span>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <XCircleIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Notification Body */}
            <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center border-2 border-white shadow-sm ${
                    alert.sourceContext === 'LinkedIn' ? 'bg-[#0077b5]' : 
                    alert.sourceContext === 'Gmail' ? 'bg-red-500' : 'bg-slate-800'
                }`}>
                   {alert.sourceContext === 'LinkedIn' ? <LinkedinIcon className="w-6 h-6 text-white" /> :
                    alert.sourceContext === 'Gmail' ? <MailIcon className="w-6 h-6 text-white" /> :
                    <BrainIcon className="w-6 h-6 text-white" />}
                </div>
                <div>
                    <h4 className="text-[15px] font-bold text-slate-900 leading-tight">{alert.title}</h4>
                    <p className="text-[13px] text-slate-600 mt-1 leading-snug line-clamp-2">{alert.message}</p>
                </div>
            </div>

            {/* Action Footer (simulated system actions) */}
            {alert.emailContent && (
                 <div className="mt-3 pt-2 border-t border-slate-100 flex gap-3">
                     <button className="text-xs font-bold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                        Open Gmail
                     </button>
                     <button className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                        Dismiss
                     </button>
                 </div>
            )}
        </div>
    </div>
  );
};
