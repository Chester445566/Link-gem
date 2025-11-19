
import React, { useState } from 'react';
import { IntegrationState, UserPreferences, UserProfile, InteractionHistory } from '../types';
import { LinkedinIcon, MailIcon, MobileIcon, BrainIcon, CheckCircleIcon, WhatsAppIcon } from './Icons';

interface SettingsPanelProps {
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  integrationState: IntegrationState;
  setIntegrationState: (i: IntegrationState) => void;
  preferences: UserPreferences;
  setPreferences: (p: UserPreferences) => void;
  interactionHistory: InteractionHistory;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  userProfile, setUserProfile, integrationState, setIntegrationState, preferences, setPreferences, interactionHistory
}) => {

  const [loadingService, setLoadingService] = useState<string | null>(null);

  const handleConnect = (service: 'linkedin' | 'gmail') => {
    setLoadingService(service);
    setTimeout(() => {
        if (service === 'linkedin') {
            setIntegrationState({
                ...integrationState,
                linkedinConnected: !integrationState.linkedinConnected,
                lastSync: Date.now(),
                syncedDataSummary: { ...integrationState.syncedDataSummary, linkedin: 'Synced: 850 Connections, 5 Skills' }
            });
        } else {
            setIntegrationState({
                ...integrationState,
                gmailConnected: !integrationState.gmailConnected,
                lastSync: Date.now(),
                syncedDataSummary: { ...integrationState.syncedDataSummary, gmail: 'Synced: 2 recent recruiter threads' }
            });
        }
        setLoadingService(null);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">System Preferences</h2>
                <p className="text-slate-500 mt-1">Manage your AI integrations and GCC regional settings.</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <BrainIcon className="w-4 h-4" />
                <span>Learning from {interactionHistory.savedJobIds.length + interactionHistory.dismissedJobIds.length} interactions</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Integrations */}
            <div className="lg:col-span-7 space-y-8">
                
                {/* Data Sources */}
                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        Data Sources
                    </h3>
                    <div className="space-y-4">
                        {/* LinkedIn Card */}
                        <div className={`p-6 rounded-xl border transition-all ${integrationState.linkedinConnected ? 'bg-white border-blue-200 ring-1 ring-blue-100 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${integrationState.linkedinConnected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <LinkedinIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 text-lg">LinkedIn Profile</h4>
                                        <p className="text-sm text-slate-500 mt-1">Imports your experience, skills, and endorsements.</p>
                                        
                                        {integrationState.linkedinConnected && (
                                            <div className="mt-3 flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md inline-flex">
                                                <CheckCircleIcon className="w-3 h-3" />
                                                {integrationState.syncedDataSummary?.linkedin || "Profile Synced"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleConnect('linkedin')}
                                    disabled={loadingService === 'linkedin'}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                        integrationState.linkedinConnected 
                                        ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                    }`}
                                >
                                    {loadingService === 'linkedin' ? 'Syncing...' : integrationState.linkedinConnected ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>
                        </div>

                        {/* Gmail Card */}
                        <div className={`p-6 rounded-xl border transition-all ${integrationState.gmailConnected ? 'bg-white border-red-200 ring-1 ring-red-100 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${integrationState.gmailConnected ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <MailIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 text-lg">Gmail Intelligence</h4>
                                        <p className="text-sm text-slate-500 mt-1">Scans for recruiter emails from KSA/UAE/GCC.</p>
                                        
                                        {integrationState.gmailConnected && (
                                            <div className="mt-3 flex items-center gap-2 text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-md inline-flex">
                                                <CheckCircleIcon className="w-3 h-3" />
                                                {integrationState.syncedDataSummary?.gmail || "Inbox Active"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleConnect('gmail')}
                                    disabled={loadingService === 'gmail'}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                        integrationState.gmailConnected 
                                        ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50' 
                                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg'
                                    }`}
                                >
                                    {loadingService === 'gmail' ? 'Verifying...' : integrationState.gmailConnected ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* GCC Regional Settings */}
                <section>
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">GCC Context</h3>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Legal/Visa Status</label>
                                 <select 
                                    value={userProfile.visaStatus || 'Non-Resident'}
                                    onChange={(e) => setUserProfile({...userProfile, visaStatus: e.target.value as any})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                                 >
                                     <option value="Citizen">GCC Citizen</option>
                                     <option value="Iqama (Transferable)">Iqama (Transferable)</option>
                                     <option value="Visit Visa">Visit Visa</option>
                                     <option value="Non-Resident">Non-Resident (Need Visa)</option>
                                 </select>
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Arabic Proficiency</label>
                                 <select 
                                    value={userProfile.arabicProficiency || 'None'}
                                    onChange={(e) => setUserProfile({...userProfile, arabicProficiency: e.target.value as any})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                                 >
                                     <option value="Native">Native</option>
                                     <option value="Fluent">Fluent</option>
                                     <option value="Intermediate">Intermediate</option>
                                     <option value="None">None</option>
                                 </select>
                             </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                            <input 
                                type="text" 
                                value={userProfile.location || ''}
                                onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none"
                                placeholder="e.g. Riyadh, Saudi Arabia"
                            />
                        </div>
                     </div>
                </section>

            </div>

            {/* Right Column: Notifications & Preferences */}
            <div className="lg:col-span-5 space-y-8">
                
                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MobileIcon className="w-4 h-4" />
                        Notifications
                    </h3>
                    
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 space-y-6">
                             <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-bold text-slate-900">Push Notifications</label>
                                    <p className="text-xs text-slate-500">Receive real-time alerts on mobile.</p>
                                </div>
                                <button 
                                    onClick={() => setPreferences({...preferences, notificationsEnabled: !preferences.notificationsEnabled})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.notificationsEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                             </div>

                             <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <WhatsAppIcon className="w-4 h-4 text-green-500" />
                                        WhatsApp Alerts
                                    </label>
                                    <p className="text-xs text-slate-500">Receive daily job summaries on WhatsApp.</p>
                                </div>
                                <button 
                                    onClick={() => setPreferences({...preferences, whatsappAlertsEnabled: !preferences.whatsappAlertsEnabled})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.whatsappAlertsEnabled ? 'bg-green-500' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.whatsappAlertsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                             </div>
                        </div>
                        <div className="p-6 bg-slate-50">
                             <h4 className="text-xs font-bold text-slate-700 mb-3">Filtering Rules</h4>
                             <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Minimum Salary (SAR/AED)</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={preferences.minSalary}
                                            onChange={(e) => setPreferences({...preferences, minSalary: e.target.value})}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                            placeholder="20,000"
                                        />
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    </div>
  );
};
