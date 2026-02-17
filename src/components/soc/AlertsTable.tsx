import { SeverityBadge } from './SeverityBadge';
import { VerdictBadge } from './VerdictBadge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Severity, Verdict } from '@/types/soc';

export interface AlertRow {
  id: string;
  severity: Severity;
  sender: string;
  subject: string;
  risk_score: number;
  verdict: string;
  status: string;
  created_at: string;
  analyst?: string | null;
}

interface AlertsTableProps {
  alerts: AlertRow[];
  compact?: boolean;
  className?: string;
}

export function AlertsTable({ alerts, compact = false, className }: AlertsTableProps) {
  const navigate = useNavigate();

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="soc-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Severity</th>
            {!compact && <th>Sender</th>}
            <th>Subject</th>
            {!compact && <th>Risk</th>}
            <th>Verdict</th>
            <th>Status</th>
            {!compact && <th>Analyst</th>}
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr
              key={alert.id}
              onClick={() => navigate(`/alerts/${alert.id}`)}
              className={cn(
                alert.severity === 'HOT' && 'bg-severity-hot/5',
                alert.status === 'OPEN' && alert.severity === 'HOT' && 'animate-pulse-glow'
              )}
            >
              <td className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
              </td>
              <td>
                <SeverityBadge severity={alert.severity} />
              </td>
              {!compact && (
                <td className="max-w-[200px] truncate text-foreground">
                  {alert.sender}
                </td>
              )}
              <td className="max-w-[300px] truncate text-foreground font-medium">
                {alert.subject}
              </td>
              {!compact && (
                <td>
                  <span className={cn(
                    'font-mono text-sm',
                    alert.risk_score >= 0.75 && 'text-severity-hot',
                    alert.risk_score >= 0.30 && alert.risk_score < 0.75 && 'text-severity-warm',
                    alert.risk_score < 0.30 && 'text-severity-cold'
                  )}>
                    {Math.round(alert.risk_score * 100)}%
                  </span>
                </td>
              )}
              <td>
                <VerdictBadge verdict={alert.verdict as Verdict} showIcon={false} />
              </td>
              <td>
                <span className={cn(
                  'text-xs font-medium',
                  alert.status === 'OPEN' ? 'text-severity-warm' : 'text-muted-foreground'
                )}>
                  {alert.status}
                </span>
              </td>
              {!compact && (
                <td className="text-sm text-muted-foreground">
                  {alert.analyst || '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
