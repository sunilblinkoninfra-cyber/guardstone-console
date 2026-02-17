import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, Download, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

/* =========================
   Types aligned to backend
========================= */

type LogEntry = {
  id: string;
  sender: string;
  recipient?: string | null;
  subject: string;
  risk_score: number; // 0.0 – 1.0
  created_at: string;
};

/* =========================
   Component
========================= */

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("24h");

  /* =========================
     Fetch cold emails only
  ========================= */
  useEffect(() => {
    api
      .get<{ data: LogEntry[] }>("/alerts")
      .then((res) => {
        // Cold = risk_score < 0.30
        const coldOnly = res.data.data.filter(
          (l) => l.risk_score < 0.3
        );
        setLogs(coldOnly);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     Search filtering (unchanged)
  ========================= */
  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.recipient ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [logs, searchQuery]);

  /* =========================
     Render states
  ========================= */

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading logs…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load logs: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cold (low-risk) email activity logs for compliance
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by sender, recipient, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px] bg-card border-border">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="1h">Last hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Info Banner */}
      <div className="bg-severity-cold/10 border border-severity-cold/20 rounded-lg p-4 text-sm">
        <p className="text-severity-cold font-medium">
          Cold emails only
        </p>
        <p className="text-muted-foreground mt-1">
          This log shows emails classified as low-risk (score &lt; 0.30)
          that were delivered without creating alerts.
          These are retained for compliance and auditing purposes.
        </p>
      </div>

      {/* Logs Table */}
      <div className="soc-card p-0 overflow-x-auto">
        <table className="soc-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>From</th>
              <th>To</th>
              <th>Subject</th>
              <th>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-muted/20 cursor-default"
              >
                <td className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                  <div>
                    {format(
                      new Date(log.created_at),
                      "HH:mm:ss"
                    )}
                  </div>
                  <div className="text-xs">
                    {formatDistanceToNow(
                      new Date(log.created_at),
                      { addSuffix: true }
                    )}
                  </div>
                </td>
                <td className="max-w-[200px] truncate text-foreground font-mono text-sm">
                  {log.sender}
                </td>
                <td className="max-w-[200px] truncate text-foreground font-mono text-sm">
                  {log.recipient ?? "—"}
                </td>
                <td className="max-w-[300px] truncate text-foreground">
                  {log.subject}
                </td>
                <td>
                  <span className="font-mono text-sm text-severity-cold">
                    {Math.round(log.risk_score * 100)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No logs match your search
          </p>
        </div>
      )}

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredLogs.length} of {logs.length} entries
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
