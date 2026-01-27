import { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, ShieldX, Mail } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AlertsTable } from "@/components/soc/AlertsTable";
import { SeverityTrendChart } from "@/components/dashboard/SeverityTrendChart";

type DashboardStats = {
  totalEmails: number;
  cold: number;
  warm: number;
  hot: number;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmails: 0,
    cold: 0,
    warm: 0,
    hot: 0,
  });

  /**
   * NOTE:
   * Backend does NOT expose /alerts yet.
   * This dashboard runs in "empty SOC" mode safely.
   */
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="text-muted-foreground">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI ROW */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          title="Emails Scanned"
          value={stats.totalEmails}
          icon={Mail}
        />
        <KpiCard
          title="Cold (Low Risk)"
          value={stats.cold}
          icon={ShieldCheck}
        />
        <KpiCard
          title="Warm (Suspicious)"
          value={stats.warm}
          icon={AlertTriangle}
        />
        <KpiCard
          title="Hot (High Risk)"
          value={stats.hot}
          icon={ShieldX}
        />
      </div>

      {/* TREND */}
      <Card>
        <CardContent className="pt-6">
          <SeverityTrendChart data={[]} />
        </CardContent>
      </Card>

      {/* ALERTS TABLE */}
      <Card>
        <CardContent className="pt-6">
          <AlertsTable alerts={[]} />
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: any;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}
