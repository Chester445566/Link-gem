
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Job, UserProfile, AnalysisResult, Alert, IntegrationState, InteractionHistory, UserPreferences } from './types';
import { MOCK_JOBS } from './services/mockData';
import { analyzeJobMatch, generateSmartAlerts } from './services/geminiService';
import { Sidebar } from './components/Sidebar';
import { JobCard } from './components/JobCard';
import { AnalysisPanel } from './components/AnalysisPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { GmailComposer } from './components/GmailComposer';
import { NotificationToast } from './components/NotificationToast';
import { ApplyModal } from './components/ApplyModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { InterviewPrepModal } from './components/InterviewPrepModal';
import { BellIcon, PlusIcon, LinkedinIcon, MailIcon, SparklesIcon, BrainIcon, MobileIcon, MenuIcon, CheckCircleIcon, DownloadIcon, WhatsAppIcon } from './components/Icons';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.JOBS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSmartAlerts, setIsGeneratingSmartAlerts] = useState(false);
  const [toastAlert, setToastAlert] = useState<Alert | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [jobToPrep, setJobToPrep] = useState<Job | null>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Ahmed Al-Salem",
    title: "Senior Frontend Engineer",
    bio: "Passionate React developer based in Riyadh with 6 years of experience. Contributing to Vision 2030 digital transformation projects.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Arabic (Native)"],
    targetRoles: ["Frontend Engineer", "Tech Lead"],
    email: "ahmed.dev@example.com",
    phone: "+966 55 123 4567",
    profileStrength: 60,
    location: "Riyadh, Saudi Arabia",
    arabicProficiency: 'Native',
    visaStatus: 'Citizen'
  });

  const [integrationState, setIntegrationState] = useState<IntegrationState>({
    linkedinConnected: false,
    gmailConnected: false
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    notificationFrequency: 'realtime',
    minSalary: '',
    remoteOnly: false,
    notificationsEnabled: true,
    emailAlertsEnabled: true,
    whatsappAlertsEnabled: false
  });

  const [interactionHistory, setInteractionHistory] = useState<InteractionHistory>({
    savedJobIds: [],
    dismissedJobIds: [],
    viewedJobIds: [],
    lastInteraction: Date.now()
  });

  const [analysisMap, setAnalysisMap] = useState<Record<string, AnalysisResult>>({});
  const [emailComposer, setEmailComposer] = useState<{isOpen: boolean, subject: string, body: string}>({
    isOpen: false, subject: '', body: ''
  });

  useEffect(() => {
    const loadState = () => {
        const saved = localStorage.getItem('linkgen_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.jobs) setJobs(parsed.jobs);
                if (parsed.history) setInteractionHistory(parsed.history);
                if (parsed.integration) setIntegrationState(parsed.integration);
                if (parsed.profile) setUserProfile(parsed.profile);
                if (parsed.alerts) setAlerts(parsed.alerts);
                if (parsed.preferences) setPreferences(parsed.preferences);
            } catch(e) { console.error("Failed to load state"); }
        }
    };
    loadState();
  }, []);

  useEffect(() => {
     const stateToSave = {
         jobs,
         history: interactionHistory,
         integration: integrationState,
         profile: userProfile,
         alerts,
         preferences
     };
     localStorage.setItem('linkgen_state', JSON.stringify(stateToSave));
  }, [jobs, interactionHistory, integrationState, userProfile, alerts, preferences]);

  useEffect(() => {
    if (integrationState.linkedinConnected || integrationState.gmailConnected) {
        triggerSmartAlerts();
    }
    
    if (integrationState.linkedinConnected) {
        setUserProfile(prev => ({ ...prev, profileStrength: 100 }));
    } else {
        setUserProfile(prev => ({ ...prev, profileStrength: 60 }));
    }
  }, [integrationState.linkedinConnected, integrationState.gmailConnected]);

  useEffect(() => {
    if (interactionHistory.savedJobIds.length > 0 && interactionHistory.savedJobIds.length % 2 === 0) {
        triggerSmartAlerts();
    }
  }, [interactionHistory.savedJobIds.length]);

  const triggerSmartAlerts = async () => {
    if (isGeneratingSmartAlerts) return;
    setIsGeneratingSmartAlerts(true);
    try {
        const availableJobs = jobs.filter(j => !interactionHistory.dismissedJobIds.includes(j.id));
        const smartAlerts = await generateSmartAlerts(availableJobs, userProfile, interactionHistory, integrationState);
        
        setAlerts(prev => {
            const combined = [...smartAlerts, ...prev];
            return combined.filter((a, index, self) => 
                index === self.findIndex((t) => (t.jobId === a.jobId && t.type === a.type))
            );
        });

        setJobs(prev => prev.map(job => {
            const matchingAlert = smartAlerts.find(a => a.jobId === job.id);
            if (matchingAlert) return { ...job, smartMatchReason: matchingAlert.title };
            return job;
        }));

        const highPriority = smartAlerts.find(a => a.priority === 'high');
        if (highPriority) {
            if (preferences.notificationsEnabled) {
                setToastAlert(highPriority);
                setTimeout(() => setToastAlert(null), 6000);
            }
            
            // Simulate WhatsApp alert if enabled
            if (preferences.whatsappAlertsEnabled && highPriority.whatsappContent) {
                setTimeout(() => {
                    const waAlert: Alert = {
                        id: 'wa-' + Date.now(),
                        title: 'WhatsApp Alert Sent',
                        message: `Sent to +966...: "${highPriority.whatsappContent.substring(0, 40)}..."`,
                        timestamp: Date.now(),
                        read: true,
                        type: 'SYSTEM',
                        sourceContext: 'Learning',
                    };
                    setAlerts(prev => [waAlert, ...prev]);
                    setToastAlert(waAlert);
                    setTimeout(() => setToastAlert(null), 4000);
                }, 2000);
            }
        }

    } catch (e) {
        console.error("Error generating smart alerts", e);
    } finally {
        setIsGeneratingSmartAlerts(false);
    }
  };

  const handleAnalyze = useCallback(async (job: Job) => {
    setIsAnalyzing(true);
    setSelectedJobId(job.id);
    try {
      const result = await analyzeJobMatch(job, userProfile);
      setAnalysisMap(prev => ({ ...prev, [job.id]: result }));
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, analyzed: true, matchScore: result.matchScore } : j));
      if (result.matchScore >= 85 && preferences.notificationsEnabled) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          jobId: job.id,
          title: "Perfect Match",
          message: `${result.matchScore}% match for ${job.title}.`,
          timestamp: Date.now(),
          read: false,
          type: 'HIGH_MATCH',
          sourceContext: 'Learning',
          priority: 'high'
        };
        setAlerts(prev => [newAlert, ...prev]);
        setToastAlert(newAlert);
        setTimeout(() => setToastAlert(null), 5000);
      }
    } catch (err) { console.error(err); } finally { setIsAnalyzing(false); }
  }, [userProfile, preferences.notificationsEnabled]);

  const handleSaveJob = (job: Job) => {
    setInteractionHistory(prev => {
        const exists = prev.savedJobIds.includes(job.id);
        return {
            ...prev,
            savedJobIds: exists ? prev.savedJobIds.filter(id => id !== job.id) : [...prev.savedJobIds, job.id],
            lastInteraction: Date.now()
        };
    });
  };

  const handleDismissJob = (job: Job) => {
    setInteractionHistory(prev => ({
        ...prev,
        dismissedJobIds: [...prev.dismissedJobIds, job.id],
        lastInteraction: Date.now()
    }));
    if (selectedJobId === job.id) setSelectedJobId(null);
  };

  const handleOpenApplyModal = (job: Job) => { setJobToApply(job); setApplyModalOpen(true); };
  const handleOpenPrepModal = (job: Job) => { setJobToPrep(job); setInterviewModalOpen(true); };

  const handleConnectLinkedinFromModal = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIntegrationState(prev => ({
          ...prev,
          linkedinConnected: true,
          lastSync: Date.now(),
          syncedDataSummary: { ...prev.syncedDataSummary, linkedin: 'Synced: 850 Connections, 5 Skills' }
      }));
      triggerSmartAlerts();
  };

  const handleSubmitApplication = (jobId: string) => {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true, applicationDate: Date.now(), applicationStatus: 'Applied' } : j));
      setApplyModalOpen(false);
      const newAlert: Alert = {
          id: Date.now().toString(),
          jobId,
          title: "Application Sent!",
          message: `Good luck!`,
          timestamp: Date.now(),
          read: false,
          type: 'SYSTEM',
          sourceContext: 'LinkedIn'
      };
      setAlerts(prev => [newAlert, ...prev]);
      setToastAlert(newAlert);
      setTimeout(() => setToastAlert(null), 5000);
  };

  const handleDraftEmail = (subject: string, body: string) => {
    setEmailComposer({ isOpen: true, subject, body });
  };
  
  const handleDownloadApp = () => {
      setIsDownloading(true);
      setMobileMenuOpen(false);
      const downloadAlert: Alert = {
          id: 'download-sys',
          title: "Downloading LinkGen GCC...",
          message: "Please wait.",
          timestamp: Date.now(),
          read: true,
          type: 'SYSTEM',
          sourceContext: 'Learning',
      };
      setToastAlert(downloadAlert);
      setTimeout(() => {
          setIsDownloading(false);
          setIsAppInstalled(true);
          setToastAlert({
              id: 'installed-sys',
              title: "Installation Complete",
              message: "Ready to use.",
              timestamp: Date.now(),
              read: false,
              type: 'SYSTEM',
              sourceContext: 'Learning'
          });
      }, 2500);
  };

  const visibleJobs = jobs.filter(j => !interactionHistory.dismissedJobIds.includes(j.id));
  const selectedJob = jobs.find(j => j.id === selectedJobId) || null;

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <div className="p-4 md:p-8 space-y-8 pb-20 md:pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-slate-500 text-sm font-medium mb-2">Saved Jobs</h3>
                    <p className="text-3xl font-bold text-slate-900">{interactionHistory.savedJobIds.length}</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-5">
                    <SparklesIcon className="w-24 h-24" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-sm bg-purple-50/30 relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="text-purple-700 text-sm font-medium mb-2">Smart Matches</h3>
                    <p className="text-3xl font-bold text-purple-700">{alerts.filter(a => a.type === 'SMART_MATCH').length}</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 text-purple-600"><BrainIcon className="w-24 h-24" /></div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-500 text-sm font-medium mb-2">Applications</h3>
                <p className="text-3xl font-bold text-slate-900">{jobs.filter(j => j.applied).length}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {alerts.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">No activity yet.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {alerts.slice(0, 5).map(alert => (
                                    <div key={alert.id} className="p-4 flex items-start gap-3 hover:bg-slate-50">
                                        <div className={`w-2 h-2 mt-2 rounded-full ${alert.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                                            <p className="text-xs text-slate-500">{alert.message}</p>
                                            <span className="text-[10px] text-slate-400 mt-1 block">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recommended for You</h3>
                    <div className="space-y-4">
                        {visibleJobs.filter(j => j.matchScore && j.matchScore > 80).slice(0, 3).map(job => (
                             <JobCard 
                                key={job.id} 
                                job={job} 
                                onAnalyze={handleAnalyze}
                                onClick={(j) => { setSelectedJobId(j.id); setCurrentView(AppView.JOBS); }}
                                onSave={handleSaveJob}
                                onDismiss={handleDismissJob}
                                onApply={handleOpenApplyModal}
                                isSelected={false}
                                isSaved={interactionHistory.savedJobIds.includes(job.id)}
                            />
                        ))}
                        {visibleJobs.filter(j => j.matchScore && j.matchScore > 80).length === 0 && (
                            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-400">
                                Analyze more jobs to get recommendations.
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        );
      
      case AppView.JOBS:
        return (
          <div className="h-full flex flex-col md:flex-row overflow-hidden relative">
            {/* Feed */}
            <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-4 ${selectedJobId ? 'hidden md:block' : 'block'}`}>
               <div className="flex justify-between items-center mb-2">
                   <h2 className="text-xl font-bold text-slate-900">Latest Jobs in GCC</h2>
                   <div className="text-xs text-slate-500">
                       {visibleJobs.length} jobs found
                   </div>
               </div>
               {visibleJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onAnalyze={handleAnalyze}
                  onClick={() => setSelectedJobId(job.id)}
                  onSave={handleSaveJob}
                  onDismiss={handleDismissJob}
                  onApply={handleOpenApplyModal}
                  isSelected={selectedJobId === job.id}
                  isSaved={interactionHistory.savedJobIds.includes(job.id)}
                />
              ))}
            </div>

            {/* Details Panel (Desktop: Side, Mobile: Full Overlay) */}
            <div className={`
                md:w-[450px] md:border-l md:border-slate-200 bg-white
                fixed md:static inset-0 z-30 md:z-auto
                transform transition-transform duration-300
                ${selectedJobId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
               {selectedJobId && (
                   <AnalysisPanel 
                        job={selectedJob} 
                        analysisResult={selectedJobId ? analysisMap[selectedJobId] : null}
                        userProfile={userProfile}
                        isAnalyzing={isAnalyzing}
                        onClose={() => setSelectedJobId(null)}
                        onDraftEmail={handleDraftEmail}
                   />
               )}
               {!selectedJobId && (
                   <div className="hidden md:flex h-full items-center justify-center text-slate-400 bg-slate-50">
                       Select a job to view details
                   </div>
               )}
            </div>
          </div>
        );

      case AppView.APPLICATIONS:
        return <ApplicationTracker jobs={jobs} onPrepInterview={handleOpenPrepModal} />;

      case AppView.ALERTS:
        return (
          <div className="p-4 md:p-8 max-w-3xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
                <button onClick={() => setAlerts(prev => prev.map(a => ({...a, read: true})))} className="text-sm text-blue-600 hover:underline">
                    Mark all read
                </button>
            </div>
            <div className="space-y-4">
              {alerts.length === 0 && <div className="text-center text-slate-500 py-10">No alerts yet.</div>}
              {alerts.map(alert => (
                <div key={alert.id} className={`bg-white p-5 rounded-xl border shadow-sm transition-all ${alert.read ? 'border-slate-100 opacity-70' : 'border-blue-100 ring-1 ring-blue-50'}`}>
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        alert.type === 'HIGH_MATCH' ? 'bg-green-100 text-green-600' :
                        alert.type === 'SMART_MATCH' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {alert.type === 'HIGH_MATCH' ? <SparklesIcon className="w-5 h-5" /> : <BellIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                            <span className="text-[10px] text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                        
                        {(alert.emailContent || alert.whatsappContent) && (
                            <div className="mt-3 flex gap-2">
                                {alert.emailContent && (
                                    <button 
                                        onClick={() => handleDraftEmail(alert.emailContent!.subject, alert.emailContent!.body)}
                                        className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <MailIcon className="w-3 h-3" /> View Email Draft
                                    </button>
                                )}
                                {alert.whatsappContent && (
                                    <button 
                                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(alert.whatsappContent!)}`, '_blank')}
                                        className="text-xs bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <WhatsAppIcon className="w-3 h-3" /> Send WhatsApp
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case AppView.SETTINGS:
        return (
          <div className="pb-20 md:pb-0">
            <SettingsPanel 
                userProfile={userProfile} 
                setUserProfile={setUserProfile}
                integrationState={integrationState}
                setIntegrationState={setIntegrationState}
                preferences={preferences}
                setPreferences={setPreferences}
                interactionHistory={interactionHistory}
            />
          </div>
        );

      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        alerts={alerts}
        userProfile={userProfile}
        integrationState={integrationState}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onDownloadApp={handleDownloadApp}
        isAppInstalled={isAppInstalled}
      />
      
      <div className="flex-1 flex flex-col h-full relative md:ml-64 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
            <div className="flex items-center gap-3">
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg text-slate-800">LinkGen GCC</h1>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => setCurrentView(AppView.ALERTS)} className="relative p-2">
                    <BellIcon className="w-6 h-6 text-slate-600" />
                    {alerts.filter(a => !a.read).length > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    )}
                </button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth relative">
            {renderContent()}
        </main>

        <GmailComposer 
            isOpen={emailComposer.isOpen} 
            subject={emailComposer.subject} 
            body={emailComposer.body} 
            to="hiring-manager@company.com"
            onClose={() => setEmailComposer(prev => ({ ...prev, isOpen: false }))}
        />

        <NotificationToast 
            alert={toastAlert} 
            onClose={() => setToastAlert(null)} 
        />

        <ApplyModal 
            isOpen={applyModalOpen}
            onClose={() => setApplyModalOpen(false)}
            job={jobToApply}
            userProfile={userProfile}
            integrationState={integrationState}
            onConnectLinkedin={handleConnectLinkedinFromModal}
            onSubmit={handleSubmitApplication}
        />

        <InterviewPrepModal
            isOpen={interviewModalOpen}
            onClose={() => setInterviewModalOpen(false)}
            job={jobToPrep}
        />

        {/* Download Overlay */}
        {isDownloading && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-2xl shadow-2xl w-64 text-center animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DownloadIcon className="w-8 h-8 text-blue-600 animate-bounce" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Installing...</h3>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-blue-600 animate-progress w-full origin-left" />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
