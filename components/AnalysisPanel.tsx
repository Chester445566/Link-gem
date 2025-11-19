
import React, { useState } from 'react';
import { Job, AnalysisResult, UserProfile } from '../types';
import { SparklesIcon, MailIcon, XCircleIcon, WhatsAppIcon } from './Icons';
import { generateCoverEmail, generateWhatsAppMessage } from '../services/geminiService';

interface AnalysisPanelProps {
  job: Job | null;
  analysisResult: AnalysisResult | null;
  userProfile: UserProfile;
  isAnalyzing: boolean;
  onClose: () => void;
  onDraftEmail: (subject: string, body: string) => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ job, analysisResult, userProfile, isAnalyzing, onClose, onDraftEmail }) => {
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  if (!job) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <SparklesIcon className="w-12 h-12 mb-4 opacity-20" />
        <p>Select a job to view details or analyze fit.</p>
      </div>
    );
  }

  const handleGenerateEmail = async () => {
    if (!analysisResult) return;
    setIsDrafting(true);
    setDraftError(null);
    try {
      const email = await generateCoverEmail(job, userProfile, analysisResult);
      onDraftEmail(email.subject, email.body);
    } catch (error) {
      setDraftError("Failed to generate email.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleWhatsApp = async () => {
      setIsDrafting(true);
      try {
          const msg = await generateWhatsAppMessage(job, userProfile);
          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
      } finally {
          setIsDrafting(false);
      }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">{job.title}</h2>
          <p className="text-sm text-blue-600 font-medium">{job.company}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <XCircleIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Job Description Snippet */}
        <div className="prose prose-sm prose-slate max-w-none">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Description</h3>
          <p className="text-slate-600 whitespace-pre-line text-sm leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Analysis Section */}
        {isAnalyzing ? (
          <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center text-blue-700 animate-pulse">
            <SparklesIcon className="w-8 h-8 mb-2 animate-spin" />
            <p className="font-medium">Gemini is analyzing this role...</p>
          </div>
        ) : analysisResult ? (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-purple-500" />
                AI Analysis
              </h3>
              <span className={`text-lg font-bold ${
                analysisResult.matchScore >= 80 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {analysisResult.matchScore}% Match
              </span>
            </div>

            <p className="text-sm italic text-slate-600 border-l-2 border-purple-200 pl-3">
              "{analysisResult.verdict}"
            </p>
            
            {analysisResult.cultureFit && (
                 <div className="text-xs bg-indigo-50 text-indigo-800 p-2 rounded border border-indigo-100">
                     <span className="font-bold">Culture Fit:</span> {analysisResult.cultureFit}
                 </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <h4 className="text-xs font-semibold text-green-700 mb-1">Strengths</h4>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                        {analysisResult.pros.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-semibold text-red-700 mb-1">Missing Skills</h4>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                         {analysisResult.missingSkills.length > 0 ? (
                            analysisResult.missingSkills.map((p, i) => <li key={i}>{p}</li>)
                         ) : (
                            <li className="text-slate-400">No critical gaps found.</li>
                         )}
                    </ul>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                onClick={handleGenerateEmail}
                disabled={isDrafting}
                className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                {isDrafting ? '...' : <><MailIcon className="w-4 h-4" /> Email</>}
                </button>
                
                <button
                onClick={handleWhatsApp}
                disabled={isDrafting}
                className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#1da851] text-white rounded-lg text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    {isDrafting ? '...' : <><WhatsAppIcon className="w-4 h-4" /> WhatsApp</>}
                </button>
            </div>
            {draftError && <p className="text-xs text-red-500 text-center">{draftError}</p>}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">Click "Analyze" on the job card to see insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};
