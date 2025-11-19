
import React, { useState, useEffect } from 'react';
import { Job, InterviewQuestion } from '../types';
import { generateInterviewQuestions } from '../services/geminiService';
import { XCircleIcon, BrainIcon, SparklesIcon } from './Icons';

interface InterviewPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export const InterviewPrepModal: React.FC<InterviewPrepModalProps> = ({ isOpen, onClose, job }) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [revealedTips, setRevealedTips] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen && job) {
        loadQuestions();
    } else {
        setQuestions([]);
        setRevealedTips([]);
    }
  }, [isOpen, job]);

  const loadQuestions = async () => {
      if (!job) return;
      setLoading(true);
      try {
          const result = await generateInterviewQuestions(job);
          setQuestions(result);
      } finally {
          setLoading(false);
      }
  };

  const toggleTip = (index: number) => {
      if (revealedTips.includes(index)) {
          setRevealedTips(prev => prev.filter(i => i !== index));
      } else {
          setRevealedTips(prev => [...prev, index]);
      }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
            <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <BrainIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="font-bold text-slate-900">Interview Coach</h2>
                    <p className="text-xs text-slate-500">Prep for {job.company}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <SparklesIcon className="w-8 h-8 text-purple-500 animate-spin mb-3" />
                    <p className="font-medium text-slate-700">Generating questions based on job description...</p>
                    <p className="text-xs text-slate-400 mt-1">Analyzing required skills and company culture.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((q, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-xl p-4 transition-all hover:shadow-md bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${q.type === 'Technical' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                                    {q.type}
                                </span>
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-3 text-base">
                                {q.question}
                            </h3>
                            
                            <div className="pt-2">
                                <button 
                                    onClick={() => toggleTip(idx)}
                                    className="flex items-center gap-2 text-xs font-medium text-purple-600 hover:text-purple-700"
                                >
                                    <SparklesIcon className="w-3 h-3" />
                                    {revealedTips.includes(idx) ? 'Hide AI Tip' : 'Show AI Answer Tip'}
                                </button>
                                
                                {revealedTips.includes(idx) && (
                                    <div className="mt-3 bg-purple-50 border border-purple-100 rounded-lg p-3 text-sm text-slate-700 animate-in slide-in-from-top-2">
                                        <span className="font-bold text-purple-800 text-xs block mb-1">AI SUGGESTION:</span>
                                        {q.aiTip}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
                Done Practicing
            </button>
        </div>

      </div>
    </div>
  );
};
