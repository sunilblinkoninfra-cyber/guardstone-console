import { useEffect, useMemo, useState } from "react";
import { AlertsTable } from "@/components/soc/AlertsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Severity, AlertStatus } from "@/types/soc";
import { api } from "@/lib/api";

/* =========================
   Types aligned to backend
   ========================= */
type BackendAlert = {
  id: string;
  sender: string;
  subject: string;
  risk_score: number; // 0.0 – 1.0
  verdict: string;
  status: AlertStatus;
  created_at: string;
  analyst?: string | null;
};

type UiAlert = BackendAlert & {
  severity: Severity;
};

/* =========================
   Helpers
   ========================= */
function severityFromScore(score: number): Severity {
  if (score < 0.3) return "COLD";
  if (score < 0.75) return "WARM";
  return "HOT";
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<UiAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "ALL">("ALL");

  /* =========================
     Fetch alerts from backend
     ========================= */
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get<{ data: BackendAlert[] }>("/alerts");

      const mapped: UiAlert[] = res.data.map((a) => ({
        ...a,
        severity: severityFromScore(a.risk_score),
      }));

      setAlerts(mapped);
    } catch (err: any) {
      setError(err.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  /* =========================
     Filtering logic (unchanged)
     ========================= */
  const nonColdAlerts = useMemo(
    () => alerts.filter((a) => a.severity !== "COLD"),
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    return nonColdAlerts.filter((alert) => {
      const matchesSearch =
        alert.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.sender.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity =
        severityFilter === "ALL" || alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === "ALL" || alert.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [nonColdAlerts, searchQuery, severityFilter, statusFilter]);

  const openCount = nonColdAlerts.filter(
    (a) => a.status === "OPEN"
  ).length;

  const hotOpenCount = nonColdAlerts.filter(
    (a) => a.severity === "HOT" && a.status === "OPEN"
  ).length;

  /* =========================
     Render states
     ========================= */
  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading alerts…</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load alerts: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {openCount} open alerts • {hotOpenCount} critical
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={fetchAlerts}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by sender or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />

          <Select
            value={severityFilter}
            onValueChange={(v) =>
              setSeverityFilter(v as Severity | "ALL")
            }
          >
            <SelectTrigger className="w-[130px] bg-card border-border">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="ALL">All Severity</SelectItem>
              <SelectItem value="HOT">Hot</SelectItem>
              <SelectItem value="WARM">Warm</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as AlertStatus | "ALL")
            }
          >
            <SelectTrigger className="w-[130px] bg-card border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="FALSE_POSITIVE">
                False Positive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="soc-card p-0">
        <AlertsTable alerts={filteredAlerts} />
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No alerts match your filters
          </p>
        </div>
      )}
    </div>
  );
}
