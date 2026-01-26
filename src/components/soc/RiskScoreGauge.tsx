import { cn } from '@/lib/utils';
import { computeSeverity } from '@/types/soc';

interface RiskScoreGaugeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RiskScoreGauge({ score, showLabel = true, size = 'md', className }: RiskScoreGaugeProps) {
  const severity = computeSeverity(score);
  const percentage = Math.round(score * 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    COLD: 'bg-severity-cold',
    WARM: 'bg-severity-warm',
    HOT: 'bg-severity-hot',
  };

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Risk Score</span>
          <span className={cn(
            'text-sm font-mono font-semibold',
            severity === 'COLD' && 'text-severity-cold',
            severity === 'WARM' && 'text-severity-warm',
            severity === 'HOT' && 'text-severity-hot'
          )}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={cn('risk-gauge', sizeClasses[size])}>
        <div
          className={cn('risk-gauge-fill', colorClasses[severity])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
