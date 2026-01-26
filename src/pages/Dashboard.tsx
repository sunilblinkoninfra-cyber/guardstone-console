import { Mail, ShieldCheck, AlertTriangle, ShieldX, Ban, Flag } from 'lucide-react';
import { KPICard } from '@/components/soc/KPICard';
import { AlertsTable } from '@/components/soc/AlertsTable';
import { kpiData, trendData, alerts } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const hotAlerts = alerts.filter(a => a.severity === 'HOT' && a.status === 'OPEN');

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">SOC Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Security overview for the last 24 hours
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Emails Scanned"
          value={kpiData.emailsScanned24h}
          icon={Mail}
        />
        <KPICard
          title="Cold (Low Risk)"
          value={kpiData.coldCount}
          variant="cold"
          icon={ShieldCheck}
        />
        <KPICard
          title="Warm (Suspicious)"
          value={kpiData.warmCount}
          variant="warm"
          icon={AlertTriangle}
        />
        <KPICard
          title="Hot (High Risk)"
          value={kpiData.hotCount}
          variant="hot"
          icon={ShieldX}
        />
        <KPICard
          title="Blocked"
          value={kpiData.blockedEmails}
          icon={Ban}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="False Positives"
          value={kpiData.falsePositives}
          icon={Flag}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Trend Chart */}
      <div className="soc-card">
        <h2 className="soc-card-header mb-4">Severity Trend (24h)</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorCold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWarm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
              <XAxis
                dataKey="hour"
                stroke="hsl(215, 20%, 55%)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(215, 20%, 55%)"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(217, 33%, 18%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="cold"
                name="Cold"
                stroke="hsl(142, 76%, 45%)"
                fill="url(#colorCold)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="warm"
                name="Warm"
                stroke="hsl(38, 92%, 50%)"
                fill="url(#colorWarm)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="hot"
                name="Hot"
                stroke="hsl(0, 84%, 60%)"
                fill="url(#colorHot)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hot Alerts Table */}
      <div className="soc-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="soc-card-header flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-severity-hot animate-pulse" />
            Hot Alerts Requiring Action
          </h2>
          <span className="text-xs text-muted-foreground">
            {hotAlerts.length} open
          </span>
        </div>
        <AlertsTable alerts={hotAlerts} compact />
      </div>
    </div>
  );
}
