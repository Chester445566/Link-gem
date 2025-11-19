
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  JOBS = 'JOBS',
  APPLICATIONS = 'APPLICATIONS',
  ALERTS = 'ALERTS',
  SETTINGS = 'SETTINGS'
}

export type ApplicationStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt: string;
  description: string;
  logoUrl: string;
  salary?: string;
  currency?: 'SAR' | 'AED' | 'QAR' | 'USD'; // GCC Currencies
  type: 'Remote' | 'On-site' | 'Hybrid';
  source: 'LinkedIn' | 'Manual' | 'Gmail Scan';
  analyzed?: boolean;
  matchScore?: number;
  analysisSummary?: string;
  smartMatchReason?: string;
  matchDetails?: {
    reason: string;
    keywords: string[];
  };
  applied?: boolean;
  applicationDate?: number;
  applicationStatus?: ApplicationStatus;
  applicantsCount?: number;
  alumniCount?: number;
  isPromoted?: boolean;
  // GCC Specifics
  visaRequirements?: 'Saudi National' | 'Iqama Transferable' | 'Open to All' | 'UAE National';
  arabicRequired?: boolean;
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  targetRoles: string[];
  email?: string;
  phone?: string;
  profileStrength?: number;
  // GCC Specifics
  location?: string;
  arabicProficiency?: 'Native' | 'Fluent' | 'Intermediate' | 'None';
  visaStatus?: 'Citizen' | 'Iqama (Transferable)' | 'Visit Visa' | 'Non-Resident';
}

export interface IntegrationState {
  linkedinConnected: boolean;
  gmailConnected: boolean;
  lastSync?: number;
  syncedDataSummary?: {
    linkedin?: string;
    gmail?: string;
  };
}

export interface UserPreferences {
  notificationFrequency: 'realtime' | 'daily' | 'weekly';
  minSalary: string;
  remoteOnly: boolean;
  notificationsEnabled: boolean;
  emailAlertsEnabled: boolean;
  whatsappAlertsEnabled: boolean;
}

export interface InteractionHistory {
  savedJobIds: string[];
  dismissedJobIds: string[];
  viewedJobIds: string[];
  lastInteraction: number;
}

export interface AnalysisResult {
  matchScore: number;
  pros: string[];
  cons: string[];
  missingSkills: string[];
  verdict: string;
  cultureFit?: string; // Added for GCC culture
}

export interface Alert {
  id: string;
  jobId?: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'HIGH_MATCH' | 'NEW_POST' | 'SMART_MATCH' | 'SYSTEM';
  sourceContext?: 'LinkedIn' | 'Gmail' | 'Learning';
  priority?: 'high' | 'normal';
  emailedToUser?: boolean;
  emailContent?: {
    subject: string;
    body: string;
  };
  whatsappContent?: string; // New for GCC
}

export interface InterviewQuestion {
  question: string;
  type: 'Behavioral' | 'Technical';
  aiTip: string;
}
