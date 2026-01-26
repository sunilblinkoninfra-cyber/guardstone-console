import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'cold' | 'warm' | 'hot';
  className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, variant = 'default', className }: KPICardProps) {
  const variantClasses = {
    default: '',
    cold: 'border-l-4 border-l-severity-cold',
    warm: 'border-l-4 border-l-severity-warm',
    hot: 'border-l-4 border-l-severity-hot',
  };

  return (
    <div className={cn('kpi-card', variantClasses[variant], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="soc-card-header">{title}</p>
          <p className="soc-card-value font-mono">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      {trend && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-xs',
          trend.isPositive ? 'text-severity-cold' : 'text-severity-hot'
        )}>
          {trend.isPositive ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <TrendingUp className="h-3 w-3" />
          )}
          <span>{Math.abs(trend.value)}% vs last 24h</span>
        </div>
      )}
    </div>
  );
}
