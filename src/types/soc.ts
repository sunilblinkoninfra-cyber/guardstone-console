export type Severity = 'COLD' | 'WARM' | 'HOT';
export type Verdict = 'SAFE' | 'SUSPICIOUS' | 'PHISHING';
export type AlertStatus = 'OPEN' | 'RESOLVED' | 'FALSE_POSITIVE';

export interface RiskAnalysis {
  score: number;
  verdict: Verdict;
  reasons: string[];
}

export interface NLPAnalysis {
  available: boolean;
  signals: string[];
}

export interface URLAnalysis {
  score: number;
  signals: string[];
}

export interface EmailTextAnalysis {
  score: number;
  signals: string[];
}

export interface MalwareAnalysis {
  detected: boolean;
  details?: string;
}

export interface EmailAnalysisData {
  risk: RiskAnalysis;
  nlp_analysis: NLPAnalysis;
  url_analysis: URLAnalysis;
  email_text_analysis: EmailTextAnalysis;
  malware_analysis: MalwareAnalysis;
}

export interface BackendResponse {
  success: boolean;
  data: EmailAnalysisData;
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: Severity;
  sender: string;
  subject: string;
  riskScore: number;
  verdict: Verdict;
  status: AlertStatus;
  assignedAnalyst: string | null;
  emailBody?: string;
  urls?: string[];
  attachments?: { name: string; hash: string }[];
  analysisData?: EmailAnalysisData;
}

export interface AuditLogEntry {
  id: string;
  alertId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'analyst' | 'admin';
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
}

export function computeSeverity(score: number): Severity {
  if (score < 0.30) return 'COLD';
  if (score < 0.75) return 'WARM';
  return 'HOT';
}

export function getVerdictFromString(verdict: string): Verdict {
  const upper = verdict.toUpperCase();
  if (upper === 'SAFE') return 'SAFE';
  if (upper === 'SUSPICIOUS') return 'SUSPICIOUS';
  return 'PHISHING';
}
