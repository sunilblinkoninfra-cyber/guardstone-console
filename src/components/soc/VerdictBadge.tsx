import { cn } from '@/lib/utils';
import { Verdict } from '@/types/soc';
import { ShieldCheck, AlertTriangle, ShieldX } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  showIcon?: boolean;
  className?: string;
}

export function VerdictBadge({ verdict, showIcon = true, className }: VerdictBadgeProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const verdictConfig = {
    SAFE: { class: 'verdict-safe', icon: ShieldCheck },
    SUSPICIOUS: { class: 'verdict-suspicious', icon: AlertTriangle },
    PHISHING: { class: 'verdict-phishing', icon: ShieldX },
  };

  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <span className={cn(baseClasses, config.class, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {verdict}
    </span>
  );
}
