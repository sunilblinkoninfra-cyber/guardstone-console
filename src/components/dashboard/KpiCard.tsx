import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

export function KpiCard({
  title,
  value,
  icon,
  trend,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "kpi-card flex items-center justify-between",
        className
      )}
    >
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        )}
      </div>
      {icon && <div className="text-muted-foreground">{icon}</div>}
    </div>
  );
}
