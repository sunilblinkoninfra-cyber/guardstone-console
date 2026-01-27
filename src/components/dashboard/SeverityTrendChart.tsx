import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface SeverityTrendChartProps {
  data?: any[];
}

/**
 * Placeholder chart component.
 * Safe stub until real backend metrics are wired.
 */
export function SeverityTrendChart({ data = [] }: SeverityTrendChartProps) {
  // Minimal fallback so the chart never crashes
  const fallbackData =
    data.length > 0
      ? data
      : [
          { time: "00:00", cold: 10, warm: 2, hot: 1 },
          { time: "06:00", cold: 20, warm: 5, hot: 2 },
          { time: "12:00", cold: 35, warm: 8, hot: 4 },
          { time: "18:00", cold: 25, warm: 6, hot: 3 },
          { time: "24:00", cold: 15, warm: 3, hot: 1 },
        ];

  return (
    <div className="soc-card h-[260px]">
      <h3 className="soc-card-header">Severity Trend (24h)</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={fallbackData}>
          <XAxis dataKey="time" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="cold"
            stroke="hsl(var(--severity-cold))"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="warm"
            stroke="hsl(var(--severity-warm))"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="hot"
            stroke="hsl(var(--severity-hot))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
