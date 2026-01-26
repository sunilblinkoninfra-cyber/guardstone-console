import { Alert } from '@/types/soc';
import { SeverityBadge } from './SeverityBadge';
import { VerdictBadge } from './VerdictBadge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface AlertsTableProps {
  alerts: Alert[];
  compact?: boolean;
  className?: string;
}

export function AlertsTable({ alerts, compact = false, className }: AlertsTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (alert: Alert) => {
    navigate(`/alerts/${alert.id}`);
  };

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
              onClick={() => handleRowClick(alert)}
              className={cn(
                alert.severity === 'HOT' && 'bg-severity-hot/5',
                alert.status === 'OPEN' && alert.severity === 'HOT' && 'animate-pulse-glow'
              )}
            >
              <td className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
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
                    alert.riskScore >= 0.75 && 'text-severity-hot',
                    alert.riskScore >= 0.30 && alert.riskScore < 0.75 && 'text-severity-warm',
                    alert.riskScore < 0.30 && 'text-severity-cold'
                  )}>
                    {Math.round(alert.riskScore * 100)}%
                  </span>
                </td>
              )}
              <td>
                <VerdictBadge verdict={alert.verdict} showIcon={false} />
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
                  {alert.assignedAnalyst || '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
