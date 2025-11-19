
import React from 'react';
import { Job } from '../types';
import { CheckCircleIcon, BriefcaseIcon, LinkedinIcon, BrainIcon } from './Icons';

interface ApplicationTrackerProps {
  jobs: Job[];
  onPrepInterview: (job: Job) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ jobs, onPrepInterview }) => {
  const appliedJobs = jobs.filter(j => j.applied).sort((a, b) => (b.applicationDate || 0) - (a.applicationDate || 0));

  const getStatusColor = (status?: string) => {
      switch(status) {
          case 'Interview': return 'bg-purple-100 text-purple-700 border-purple-200';
          case 'Offer': return 'bg-green-100 text-green-700 border-green-200';
          case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-blue-50 text-blue-700 border-blue-100'; // Applied
      }
  };

  if (appliedJobs.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center h-full bg-white rounded-xl border border-slate-200 border-dashed m-6">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
            <BriefcaseIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No applications yet</h3>
        <p className="text-slate-500 mt-2 max-w-xs">Start applying to jobs in the feed. Your application history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Applications</h2>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:grid">
            <div className="col-span-5">Role & Company</div>
            <div className="col-span-3">Date Applied</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Action</div>
        </div>
        
        <div className="divide-y divide-slate-100">
            {appliedJobs.map((job) => (
                <div key={job.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-5 items-start md:items-center hover:bg-slate-50 transition-colors group">
                    <div className="col-span-5 flex items-center gap-4 w-full">
                        <img src={job.logoUrl} alt={job.company} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                            <p className="text-xs text-slate-500">{job.company}</p>
                        </div>
                    </div>
                    <div className="col-span-3 text-sm text-slate-600 w-full flex justify-between md:block">
                        <span className="md:hidden text-xs text-slate-400 font-bold mr-2">APPLIED:</span>
                        {new Date(job.applicationDate || Date.now()).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 w-full">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${getStatusColor(job.applicationStatus || 'Applied')}`}>
                            {job.applicationStatus === 'Offer' ? <CheckCircleIcon className="w-3 h-3" /> : 
                             job.applicationStatus === 'Interview' ? <LinkedinIcon className="w-3 h-3" /> : 
                             <CheckCircleIcon className="w-3 h-3" />}
                            {job.applicationStatus || 'Applied'}
                        </span>
                    </div>
                    <div className="col-span-2 w-full flex justify-end">
                         <button 
                            onClick={() => onPrepInterview(job)}
                            className="text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors w-full md:w-auto justify-center"
                        >
                            <BrainIcon className="w-3 h-3" />
                            Prep
                         </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
