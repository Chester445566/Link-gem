
import React from 'react';
import { Job } from '../types';
import { SparklesIcon, CheckCircleIcon, BookmarkIcon, TrashIcon, LinkedinIcon, MailIcon } from './Icons';

interface JobCardProps {
  job: Job;
  onAnalyze: (job: Job) => void;
  onClick: (job: Job) => void;
  onSave: (job: Job) => void;
  onDismiss: (job: Job) => void;
  onApply: (job: Job) => void;
  isSelected: boolean;
  isSaved: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onAnalyze, onClick, onSave, onDismiss, onApply, isSelected, isSaved }) => {
  return (
    <div 
      onClick={() => onClick(job)}
      className={`bg-white rounded-xl border relative group cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'border-slate-200'
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start gap-3">
            <img src={job.logoUrl} alt={job.company} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-100" />
            <div>
              <h3 className="font-bold text-slate-900 line-clamp-1 text-base">{job.title}</h3>
              <p className="text-sm text-slate-500 font-medium">{job.company}</p>
              
              {/* Social Proof Line */}
              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                  {job.applicantsCount && (
                    <span className="flex items-center gap-1 text-slate-600">
                        <span className="font-bold">{job.applicantsCount}</span> applicants
                    </span>
                  )}
                  {job.visaRequirements && (
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${
                          job.visaRequirements.includes('National') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                          {job.visaRequirements}
                      </span>
                  )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
             {job.applied ? (
                 <div className="px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-green-600 text-white shadow-sm">
                    <CheckCircleIcon className="w-3 h-3" />
                    Applied
                 </div>
             ) : job.matchScore ? (
              <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                job.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                job.matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {job.matchScore}% Match
              </div>
            ) : job.isPromoted ? (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promoted</span>
            ) : null}
             
             <div className="flex gap-1">
                {job.source === 'LinkedIn' && (
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex items-center gap-1 border border-blue-100">
                        <LinkedinIcon className="w-3 h-3"/> LinkedIn
                    </span>
                )}
                {job.source === 'Gmail Scan' && (
                    <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded flex items-center gap-1 border border-red-100">
                        <MailIcon className="w-3 h-3"/> Gmail
                    </span>
                )}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 border-t border-slate-50 pt-3 flex-wrap">
            <span className="flex items-center gap-1">
            📍 {job.location}
            </span>
            <span>•</span>
            <span>{job.type}</span>
            {job.salary && (
            <>
                <span>•</span>
                <span className="text-slate-700 font-bold">
                    {job.currency || '$'} {job.salary}
                </span>
            </>
            )}
            {job.arabicRequired && (
                <>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">Arabic Req.</span>
                </>
            )}
            <span className="ml-auto text-slate-400">{job.postedAt}</span>
        </div>
        
        {job.smartMatchReason && (
            <div className="mb-4 bg-gradient-to-r from-purple-50 to-white border border-purple-100 p-2.5 rounded-lg text-xs text-purple-700 flex items-start gap-2">
                <SparklesIcon className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
                <span className="font-medium">{job.smartMatchReason}</span>
            </div>
        )}

        <div className="flex items-center gap-2 mt-auto">
            {!job.applied && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onApply(job);
                    }}
                    className="flex-1 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm active:scale-95"
                >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    Easy Apply
                </button>
            )}
            
            <button 
            onClick={(e) => {
                e.stopPropagation();
                onAnalyze(job);
            }}
            className={`px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 ${
                job.applied ? 'flex-1 bg-slate-50 text-slate-400' : 'bg-white text-slate-600'
            }`}
            >
            {job.analyzed ? (
                <>
                <CheckCircleIcon className="w-3.5 h-3.5" />
                Analyzed
                </>
            ) : (
                <>
                <SparklesIcon className="w-3.5 h-3.5" />
                Analyze
                </>
            )}
            </button>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:-translate-y-1">
        <button 
            onClick={(e) => { e.stopPropagation(); onSave(job); }}
            className={`p-2 rounded-full shadow-sm border border-slate-200 ${isSaved ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-white text-slate-400 hover:text-blue-600'}`}
            title={isSaved ? "Unsave" : "Save for later"}
        >
            <BookmarkIcon className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
        <button 
            onClick={(e) => { e.stopPropagation(); onDismiss(job); }}
            className="p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50"
            title="Dismiss"
        >
            <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
