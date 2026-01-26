import { cn } from '@/lib/utils';
import { Severity } from '@/types/soc';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const severityClasses = {
    COLD: 'severity-cold',
    WARM: 'severity-warm',
    HOT: 'severity-hot',
  };

  return (
    <span className={cn(baseClasses, severityClasses[severity], className)}>
      {severity}
    </span>
  );
}
