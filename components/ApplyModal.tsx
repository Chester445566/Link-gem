
import React, { useState, useEffect } from 'react';
import { Job, UserProfile, IntegrationState } from '../types';
import { XCircleIcon, LinkedinIcon, CheckCircleIcon, UploadIcon, FileTextIcon, SparklesIcon } from './Icons';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  userProfile: UserProfile;
  integrationState: IntegrationState;
  onConnectLinkedin: () => Promise<void>;
  onSubmit: (jobId: string) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ 
  isOpen, onClose, job, userProfile, integrationState, onConnectLinkedin, onSubmit 
}) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Form State
  const [email, setEmail] = useState(userProfile.email || 'alex.dev@example.com');
  const [phone, setPhone] = useState(userProfile.phone || '+1 (555) 123-4567');
  const [resumeName, setResumeName] = useState<string | null>('Alex_Dev_Resume_2024.pdf');

  useEffect(() => {
    if (isOpen) {
        setStep(0);
        setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleConnect = async () => {
    setIsConnecting(true);
    await onConnectLinkedin();
    setIsConnecting(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        onSubmit(job.id);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-3">
                <img src={job.logoUrl} className="w-10 h-10 rounded bg-white border border-slate-200" alt="Logo" />
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">Apply to {job.company}</h3>
                    <p className="text-xs text-slate-500">{job.title}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 border border-transparent hover:border-slate-200 transition-all">
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100">
            <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
            
            {/* Step 1: Contact Info */}
            {step === 0 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Contact Info</h2>
                        <span className="text-xs text-slate-400">Step 1 of 3</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <img src="https://ui-avatars.com/api/?name=Alex+Dev&background=2563eb&color=fff" className="w-10 h-10 rounded-full" alt="Me" />
                        <div>
                            <p className="text-sm font-bold text-slate-900">{userProfile.name}</p>
                            <p className="text-xs text-blue-600">Profile strength: {integrationState.linkedinConnected ? 'Excellent' : 'Good'}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        />
                    </div>
                </div>
            )}

            {/* Step 2: Profile & Resume (The Request Core) */}
            {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Resume & Profile</h2>
                        <span className="text-xs text-slate-400">Step 2 of 3</span>
                    </div>
                    
                    {/* Resume Upload */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-slate-700">Resume</label>
                            <button className="text-blue-600 text-xs font-medium hover:underline">Upload New</button>
                        </div>
                        {resumeName ? (
                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm group hover:border-blue-300 transition-colors cursor-pointer">
                                <FileTextIcon className="w-8 h-8 text-red-500" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-700">{resumeName}</p>
                                    <p className="text-[10px] text-slate-400">PDF • 2.4 MB</p>
                                </div>
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            </div>
                        ) : (
                             <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 bg-white">
                                <UploadIcon className="w-8 h-8 mb-2" />
                                <p className="text-sm">Upload PDF or DOCX</p>
                            </div>
                        )}
                    </div>

                    {/* LinkedIn Integration Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                LinkedIn Profile
                                <LinkedinIcon className="w-4 h-4 text-blue-600" />
                            </label>
                            {!integrationState.linkedinConnected && (
                                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">Recommended</span>
                            )}
                        </div>

                        {!integrationState.linkedinConnected ? (
                            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 text-center space-y-4 relative overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute -top-4 -right-4 text-blue-100 opacity-50">
                                    <LinkedinIcon className="w-24 h-24" />
                                </div>
                                
                                <div className="relative z-10">
                                    <h4 className="font-bold text-slate-900">Increase your application strength</h4>
                                    <p className="text-sm text-slate-600 mt-1 mb-4">Share your full profile to help our AI match your skills to this role.</p>
                                    
                                    <button 
                                        onClick={handleConnect}
                                        disabled={isConnecting}
                                        className="w-full bg-[#0077b5] hover:bg-[#006396] text-white font-semibold py-3 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {isConnecting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <LinkedinIcon className="w-4 h-4 fill-current" />
                                                Connect & Share Profile
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <div className="bg-blue-50/50 p-3 border-b border-slate-100 flex justify-between items-center">
                                    <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
                                        <CheckCircleIcon className="w-3 h-3" /> Profile Attached
                                    </span>
                                    <button className="text-xs text-slate-400 hover:text-red-500 transition-colors">Disconnect</button>
                                </div>
                                <div className="p-4 flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                                         <img src="https://ui-avatars.com/api/?name=Alex+Dev&background=0077b5&color=fff" alt="Avatar" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 text-sm truncate">{userProfile.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">{userProfile.title}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">5 Skills</span>
                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">2 Exp</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Step 3: Review */}
            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                     <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Final Review</h2>
                        <span className="text-xs text-slate-400">Step 3 of 3</span>
                    </div>
                     
                     <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm border border-slate-200">
                        <div className="flex justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Applying for</span>
                            <span className="font-medium text-slate-900 text-right">{job.title}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Email</span>
                            <span className="font-medium text-slate-900">{email}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Resume</span>
                            <span className="font-medium text-slate-900">{resumeName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">LinkedIn</span>
                            <span className={`font-medium flex items-center gap-1 ${integrationState.linkedinConnected ? 'text-blue-600' : 'text-slate-400'}`}>
                                {integrationState.linkedinConnected ? (
                                    <>
                                        <LinkedinIcon className="w-3 h-3" /> Shared
                                    </>
                                ) : 'Not shared'}
                            </span>
                        </div>
                     </div>

                     {integrationState.linkedinConnected && (
                         <div className="bg-green-50 text-green-800 p-3 rounded-lg text-xs flex items-start gap-2 border border-green-100">
                             <SparklesIcon className="w-4 h-4 mt-0.5 shrink-0" />
                             <p>Your profile strength is high! You are 20% more likely to get a response with your LinkedIn profile attached.</p>
                         </div>
                     )}

                     <p className="text-xs text-slate-400 text-center px-4 leading-relaxed">
                        By clicking Submit Application, you agree to share your provided information and LinkedIn profile data (if connected) with {job.company}.
                     </p>
                </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            {step > 0 ? (
                <button onClick={handleBack} className="text-slate-500 font-medium text-sm hover:text-slate-800 px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">
                    Back
                </button>
            ) : (
                <div />
            )}
            
            {step < 2 ? (
                <button 
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-full text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    Next Step
                </button>
            ) : (
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-8 rounded-full text-sm transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:scale-100"
                >
                    {isSubmitting ? 'Sending...' : 'Submit Application'}
                </button>
            )}
        </div>

      </div>
    </div>
  );
};
