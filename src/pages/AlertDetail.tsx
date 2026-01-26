import { useParams, useNavigate } from 'react-router-dom';
import { alerts, auditLogs, currentUser } from '@/data/mockData';
import { SeverityBadge } from '@/components/soc/SeverityBadge';
import { VerdictBadge } from '@/components/soc/VerdictBadge';
import { RiskScoreGauge } from '@/components/soc/RiskScoreGauge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Mail,
  Link2,
  Paperclip,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Ban,
  Flag,
  CheckCircle,
  Clock,
  User,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AlertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const alert = alerts.find((a) => a.id === id);
  const alertAuditLogs = auditLogs.filter((l) => l.alertId === id);

  if (!alert) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Alert not found</p>
      </div>
    );
  }

  const analysis = alert.analysisData;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/alerts')}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold text-foreground truncate">
              {alert.subject}
            </h1>
            <SeverityBadge severity={alert.severity} />
            <VerdictBadge verdict={alert.verdict} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {alert.id} • {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Email Evidence */}
        <div className="lg:col-span-2 space-y-4">
          <div className="soc-card">
            <h2 className="soc-card-header flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Evidence
            </h2>
            
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">From:</span>
                  <p className="font-mono text-foreground break-all">{alert.sender}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Received:</span>
                  <p className="text-foreground">{format(new Date(alert.timestamp), 'PPpp')}</p>
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Subject</span>
                <p className="font-medium text-foreground mt-1">{alert.subject}</p>
              </div>

              <Separator />

              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Body</span>
                <pre className="mt-2 p-4 bg-muted/30 rounded-lg text-sm text-foreground whitespace-pre-wrap font-mono">
                  {alert.emailBody}
                </pre>
              </div>

              {/* URLs - Non-clickable */}
              {alert.urls && alert.urls.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Link2 className="h-3 w-3" />
                    URLs Detected ({alert.urls.length})
                  </span>
                  <div className="mt-2 space-y-2">
                    {alert.urls.map((url, i) => (
                      <div
                        key={i}
                        className="p-2 bg-destructive/10 border border-destructive/20 rounded-md text-sm font-mono text-muted-foreground select-none"
                      >
                        {url}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments - Hash only */}
              {alert.attachments && alert.attachments.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Paperclip className="h-3 w-3" />
                    Attachments ({alert.attachments.length})
                  </span>
                  <div className="mt-2 space-y-2">
                    {alert.attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded-md text-sm"
                      >
                        <span className="text-foreground">{att.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          SHA256: {att.hash}...
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit Log */}
          <div className="soc-card">
            <h2 className="soc-card-header flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Audit Log
            </h2>
            <div className="mt-4 space-y-3">
              {alertAuditLogs.length > 0 ? (
                alertAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-foreground">
                        <span className="font-medium">{log.performedBy}</span>{' '}
                        <span className="text-muted-foreground">{log.action.replace(/_/g, ' ').toLowerCase()}</span>
                      </p>
                      {log.notes && (
                        <p className="text-muted-foreground mt-0.5">{log.notes}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(log.timestamp), 'PPpp')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No actions recorded yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Intelligence & Actions */}
        <div className="space-y-4">
          {/* Risk Score */}
          <div className="soc-card">
            <h2 className="soc-card-header">Risk Assessment</h2>
            <div className="mt-4">
              <RiskScoreGauge score={alert.riskScore} size="lg" />
            </div>
            
            {analysis && (
              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground">Findings</span>
                  <ul className="mt-2 space-y-1">
                    {analysis.risk.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-severity-hot shrink-0 mt-0.5" />
                        <span className="text-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Signal Breakdown */}
          {analysis && (
            <div className="soc-card">
              <h2 className="soc-card-header">Signal Breakdown</h2>
              <div className="mt-4 space-y-4">
                {/* NLP Signals */}
                {analysis.nlp_analysis.available && (
                  <div>
                    <span className="text-xs text-muted-foreground">NLP Analysis</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.nlp_analysis.signals.map((signal, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* URL Signals */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">URL Analysis</span>
                    <span className="text-xs font-mono text-severity-hot">
                      {Math.round(analysis.url_analysis.score * 100)}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.url_analysis.signals.map((signal, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {signal}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Text Signals */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Text Analysis</span>
                    <span className="text-xs font-mono text-severity-warm">
                      {Math.round(analysis.email_text_analysis.score * 100)}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.email_text_analysis.signals.map((signal, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {signal}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Malware Status */}
                <div>
                  <span className="text-xs text-muted-foreground">Malware Status</span>
                  <div className="mt-2 flex items-center gap-2">
                    {analysis.malware_analysis.detected ? (
                      <>
                        <ShieldX className="h-4 w-4 text-severity-hot" />
                        <span className="text-sm text-severity-hot">Malware detected</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 text-severity-cold" />
                        <span className="text-sm text-severity-cold">No malware detected</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="soc-card">
            <h2 className="soc-card-header">Actions</h2>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Flag className="h-4 w-4" />
                Mark False Positive
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-severity-hot border-severity-hot/30 hover:bg-severity-hot/10">
                <CheckCircle className="h-4 w-4" />
                Confirm Malicious
              </Button>
              {alert.severity === 'HOT' && (
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  Release Email
                </Button>
              )}
              {currentUser.role === 'admin' && (
                <Button variant="destructive" className="w-full justify-start gap-2">
                  <Ban className="h-4 w-4" />
                  Block Sender Domain
                </Button>
              )}
            </div>
          </div>

          {/* Assignment */}
          <div className="soc-card">
            <h2 className="soc-card-header">Assignment</h2>
            <div className="mt-4">
              {alert.assignedAnalyst ? (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{alert.assignedAnalyst}</span>
                </div>
              ) : (
                <Button variant="secondary" size="sm" className="w-full">
                  Assign to me
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
