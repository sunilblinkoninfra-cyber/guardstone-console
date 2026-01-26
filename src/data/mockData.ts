import { Alert, AuditLogEntry, User, Organization, Severity, Verdict, AlertStatus, EmailAnalysisData } from '@/types/soc';

export const currentUser: User = {
  id: 'usr-001',
  name: 'Sarah Chen',
  email: 'sarah.chen@acme.com',
  role: 'analyst',
};

export const organizations: Organization[] = [
  { id: 'org-001', name: 'Acme Corp' },
  { id: 'org-002', name: 'TechStart Inc' },
];

const analysisDataHigh: EmailAnalysisData = {
  risk: {
    score: 0.92,
    verdict: 'PHISHING',
    reasons: [
      'Urgency language detected',
      'Credential harvesting intent',
      'Suspicious domain (.ru)',
    ],
  },
  nlp_analysis: {
    available: true,
    signals: ['urgency', 'impersonation'],
  },
  url_analysis: {
    score: 0.9,
    signals: ['new domain', 'login page mimic'],
  },
  email_text_analysis: {
    score: 0.7,
    signals: ['password reset'],
  },
  malware_analysis: {
    detected: false,
  },
};

const analysisDataMedium: EmailAnalysisData = {
  risk: {
    score: 0.54,
    verdict: 'SUSPICIOUS',
    reasons: [
      'External sender from new domain',
      'Contains tracking pixels',
    ],
  },
  nlp_analysis: {
    available: true,
    signals: ['marketing language'],
  },
  url_analysis: {
    score: 0.4,
    signals: ['redirects present'],
  },
  email_text_analysis: {
    score: 0.3,
    signals: ['promotional content'],
  },
  malware_analysis: {
    detected: false,
  },
};

export const alerts: Alert[] = [
  {
    id: 'ALT-2024-001',
    timestamp: '2024-01-26T14:32:00Z',
    severity: 'HOT',
    sender: 'security@micros0ft-support.ru',
    subject: 'URGENT: Your account will be suspended',
    riskScore: 0.92,
    verdict: 'PHISHING',
    status: 'OPEN',
    assignedAnalyst: null,
    emailBody: 'Dear Customer,\n\nYour Microsoft account shows suspicious activity. Click here immediately to verify your identity or your account will be permanently suspended within 24 hours.\n\nVerify Now: https://micros0ft-verify.ru/login\n\nMicrosoft Security Team',
    urls: ['https://micros0ft-verify.ru/login'],
    attachments: [],
    analysisData: analysisDataHigh,
  },
  {
    id: 'ALT-2024-002',
    timestamp: '2024-01-26T13:45:00Z',
    severity: 'HOT',
    sender: 'ceo@acme-financ3.com',
    subject: 'Wire Transfer Required - Confidential',
    riskScore: 0.88,
    verdict: 'PHISHING',
    status: 'OPEN',
    assignedAnalyst: 'John Martinez',
    emailBody: 'Hi,\n\nI need you to process an urgent wire transfer. This is confidential and time-sensitive. Please respond immediately.\n\n- CEO',
    urls: [],
    attachments: [{ name: 'invoice.pdf', hash: 'a1b2c3d4e5f6' }],
    analysisData: analysisDataHigh,
  },
  {
    id: 'ALT-2024-003',
    timestamp: '2024-01-26T12:20:00Z',
    severity: 'WARM',
    sender: 'newsletter@marketing-promo.net',
    subject: 'Exclusive offer just for you!',
    riskScore: 0.54,
    verdict: 'SUSPICIOUS',
    status: 'OPEN',
    assignedAnalyst: null,
    emailBody: 'Get 50% off on all products! Limited time offer.',
    urls: ['https://marketing-promo.net/offer'],
    attachments: [],
    analysisData: analysisDataMedium,
  },
  {
    id: 'ALT-2024-004',
    timestamp: '2024-01-26T11:10:00Z',
    severity: 'WARM',
    sender: 'hr@partner-company.biz',
    subject: 'Job Application Follow-up',
    riskScore: 0.45,
    verdict: 'SUSPICIOUS',
    status: 'RESOLVED',
    assignedAnalyst: 'Sarah Chen',
    emailBody: 'Following up on your recent application...',
    urls: [],
    attachments: [{ name: 'resume.docx', hash: 'f7g8h9i0j1k2' }],
    analysisData: analysisDataMedium,
  },
  {
    id: 'ALT-2024-005',
    timestamp: '2024-01-26T10:05:00Z',
    severity: 'HOT',
    sender: 'payroll@acm3-internal.xyz',
    subject: 'Update your direct deposit information',
    riskScore: 0.85,
    verdict: 'PHISHING',
    status: 'OPEN',
    assignedAnalyst: null,
    emailBody: 'Please update your banking information immediately to avoid payroll delays.',
    urls: ['https://acm3-payroll.xyz/update'],
    attachments: [],
    analysisData: analysisDataHigh,
  },
];

export const auditLogs: AuditLogEntry[] = [
  {
    id: 'log-001',
    alertId: 'ALT-2024-004',
    action: 'MARKED_RESOLVED',
    performedBy: 'Sarah Chen',
    timestamp: '2024-01-26T11:45:00Z',
    notes: 'Verified as legitimate business communication',
  },
  {
    id: 'log-002',
    alertId: 'ALT-2024-002',
    action: 'ASSIGNED',
    performedBy: 'System',
    timestamp: '2024-01-26T13:46:00Z',
    notes: 'Auto-assigned to John Martinez',
  },
];

export const kpiData = {
  emailsScanned24h: 12847,
  coldCount: 11932,
  warmCount: 847,
  hotCount: 68,
  blockedEmails: 45,
  falsePositives: 3,
};

export const trendData = [
  { hour: '00:00', cold: 420, warm: 28, hot: 2 },
  { hour: '02:00', cold: 380, warm: 22, hot: 1 },
  { hour: '04:00', cold: 290, warm: 18, hot: 0 },
  { hour: '06:00', cold: 450, warm: 35, hot: 3 },
  { hour: '08:00', cold: 680, warm: 52, hot: 8 },
  { hour: '10:00', cold: 820, warm: 68, hot: 12 },
  { hour: '12:00', cold: 750, warm: 61, hot: 9 },
  { hour: '14:00', cold: 890, warm: 75, hot: 15 },
  { hour: '16:00', cold: 920, warm: 82, hot: 11 },
  { hour: '18:00', cold: 680, warm: 54, hot: 5 },
  { hour: '20:00', cold: 520, warm: 38, hot: 2 },
  { hour: '22:00', cold: 440, warm: 30, hot: 1 },
];

export const coldLogs = [
  {
    id: 'LOG-001',
    timestamp: '2024-01-26T14:30:00Z',
    sender: 'team@company.com',
    recipient: 'john@acme.com',
    subject: 'Weekly Team Update',
    riskScore: 0.05,
  },
  {
    id: 'LOG-002',
    timestamp: '2024-01-26T14:28:00Z',
    sender: 'noreply@github.com',
    recipient: 'dev@acme.com',
    subject: 'Your pull request was merged',
    riskScore: 0.08,
  },
  {
    id: 'LOG-003',
    timestamp: '2024-01-26T14:25:00Z',
    sender: 'calendar@google.com',
    recipient: 'sarah@acme.com',
    subject: 'Meeting reminder: 1:1 with Manager',
    riskScore: 0.02,
  },
];
