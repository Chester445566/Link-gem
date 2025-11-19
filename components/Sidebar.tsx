
import React from 'react';
import { AppView, Alert, IntegrationState, UserProfile } from '../types';
import { LayoutDashboardIcon, BriefcaseIcon, BellIcon, SettingsIcon, MenuIcon, ListIcon, SmartphoneIcon, CheckCircleIcon, DownloadIcon } from './Icons';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  alerts: Alert[];
  userProfile: UserProfile;
  integrationState: IntegrationState;
  isOpen: boolean;
  onClose: () => void;
  onDownloadApp: () => void;
  isAppInstalled: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, onChangeView, alerts, userProfile, integrationState, isOpen, onClose, onDownloadApp, isAppInstalled
}) => {
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboardIcon },
    { id: AppView.JOBS, label: 'Job Feed', icon: BriefcaseIcon },
    { id: AppView.APPLICATIONS, label: 'Applications', icon: ListIcon },
    { id: AppView.ALERTS, label: 'Alerts', icon: BellIcon, badge: unreadAlerts },
    { id: AppView.SETTINGS, label: 'Preferences', icon: SettingsIcon },
  ];

  const profileScore = integrationState.linkedinConnected ? 100 : 60;

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white font-sans border-r border-slate-200">
      <div className="p-6 flex items-center gap-3 border-b border-slate-50">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-200">L</div>
        <h1 className="font-bold text-lg text-slate-800 tracking-tight">LinkGen AI</h1>
      </div>

      {/* Profile Score Widget */}
      <div className="px-4 pt-6 pb-2">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
             <div className="flex items-center gap-2 mb-2">
                 <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                     <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=random`} alt="Me" />
                 </div>
                 <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-slate-700 truncate">{userProfile.name}</p>
                     <p className="text-[10px] text-slate-400 truncate">{userProfile.title}</p>
                 </div>
             </div>
             
             <div className="mt-2">
                 <div className="flex justify-between text-[10px] font-medium mb-1">
                     <span className="text-slate-500">Profile Strength</span>
                     <span className={profileScore === 100 ? 'text-green-600 flex items-center gap-1' : 'text-orange-500'}>
                       {profileScore === 100 && <CheckCircleIcon className="w-3 h-3" />}
                       {profileScore === 100 ? 'Complete' : `${profileScore}%`}
                     </span>
                 </div>
                 <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                     <div 
                        className={`h-1.5 rounded-full transition-all duration-1000 ${profileScore === 100 ? 'bg-green-500' : 'bg-orange-400'}`} 
                        style={{ width: `${profileScore}%` }} 
                     />
                 </div>
                 {profileScore < 100 && (
                     <button 
                        onClick={() => { onChangeView(AppView.SETTINGS); onClose(); }}
                        className="text-[10px] text-blue-600 mt-2 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors group"
                     >
                         Connect LinkedIn to boost
                         <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                     </button>
                 )}
             </div>
          </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onChangeView(item.id); onClose(); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </div>
              {item.badge ? (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[1.25rem] shadow-sm shadow-red-200">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Get App Section */}
      <div className="px-4 pb-4">
        <button 
            onClick={onDownloadApp}
            disabled={isAppInstalled}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                isAppInstalled 
                ? 'bg-green-50 border-green-100 text-green-700 cursor-default' 
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 active:scale-95'
            }`}
        >
            <div className={`p-1.5 rounded-lg ${isAppInstalled ? 'bg-green-200' : 'bg-slate-200'}`}>
                {isAppInstalled ? <CheckCircleIcon className="w-4 h-4" /> : <SmartphoneIcon className="w-4 h-4" />}
            </div>
            <div className="flex flex-col items-start">
                <span className="font-bold text-xs">{isAppInstalled ? 'App Installed' : 'Get Mobile App'}</span>
                <span className="text-[10px] opacity-70">{isAppInstalled ? 'Ready to use' : 'Download for iOS/Android'}</span>
            </div>
            {!isAppInstalled && <DownloadIcon className="w-4 h-4 ml-auto opacity-50" />}
        </button>
      </div>

      <div className="p-4 pt-0">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-4 text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
          <h3 className="font-bold text-sm mb-1 relative z-10">Pro Tip</h3>
          <p className="text-xs text-blue-100 opacity-90 leading-relaxed relative z-10">
            {integrationState.linkedinConnected 
                ? "Your LinkedIn data is actively refining job matches." 
                : "Connect LinkedIn to unlock smart matching algorithms."}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen fixed left-0 top-0 z-10">
        <SidebarContent />
      </div>

      {/* Mobile Overlay & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
