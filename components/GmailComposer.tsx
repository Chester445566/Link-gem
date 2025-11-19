import React from 'react';
import { MailIcon, XCircleIcon } from './Icons';

interface GmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  body: string;
  to: string;
}

export const GmailComposer: React.FC<GmailComposerProps> = ({ isOpen, onClose, subject, body, to }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-8 w-[500px] bg-white rounded-t-xl shadow-2xl border border-slate-200 z-50 flex flex-col h-[500px] animate-in slide-in-from-bottom-10 duration-300">
      <div className="bg-slate-900 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
        <h3 className="font-medium text-sm flex items-center gap-2">
            <div className="bg-red-500 rounded text-xs px-1 font-bold">M</div>
            New Message
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <XCircleIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="border-b border-slate-100 pb-2 mb-2">
            <input 
                className="w-full text-sm outline-none text-slate-600 placeholder:text-slate-400" 
                value={to} 
                readOnly 
                placeholder="Recipients"
            />
        </div>
        <div className="border-b border-slate-100 pb-2 mb-4">
            <input 
                className="w-full text-sm outline-none font-medium text-slate-800 placeholder:text-slate-400" 
                value={subject} 
                readOnly 
                placeholder="Subject"
            />
        </div>
        <textarea 
            className="flex-1 w-full resize-none outline-none text-sm text-slate-700 leading-relaxed p-2"
            value={body}
            readOnly
        />
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex gap-2">
            <a 
                href={`mailto:hiring-manager@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm"
            >
                Send in Gmail
            </a>
            <button className="text-slate-400 hover:text-slate-600 p-2">
                <span className="sr-only">Attach</span>
                📎
            </button>
        </div>
        <button onClick={onClose} className="text-slate-500 text-sm hover:underline">Discard</button>
      </div>
    </div>
  );
};