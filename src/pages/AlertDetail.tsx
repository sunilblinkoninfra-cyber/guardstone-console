import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

import { SeverityBadge } from "@/components/soc/SeverityBadge";
import { VerdictBadge } from "@/components/soc/VerdictBadge";
import { RiskScoreGauge } from "@/components/soc/RiskScoreGauge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  Mail,
  Link2,
  Paperclip,
  AlertTriangle,
  Ban,
  Flag,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";

import { formatDistanceToNow, format } from "date-fns";

/* =========================================================
   🔐 MINIMAL AUTH + RBAC (INLINE, NON-BREAKING)
   ========================================================= */

/**
 * Replace later with real auth.
 * For now, this gives analyst identity for audit logging.
 */
function useAuth() {
  return {
    user: {
      id: "analyst-001",
      email: "analyst@company.com",
      role: "SOC_ANALYST",
    },
  };
}

/**
 * Simple RBAC gate.
 * Extend later without changing UI code.
 */
function can(
  user: { role: string } | null,
  permission:
    | "MARK_FALSE_POSITIVE"
    | "CONFIRM_MALICIOUS"
    | "RELEASE_EMAIL"
    | "BLOCK_SENDER"
) {
  if (!user) return false;

  const roleMatrix: Record<string, string[]> = {
    SOC_ANALYST: [
      "MARK_FALSE_POSITIVE",
      "CONFIRM_MALICIOUS",
      "RELEASE_EMAIL",
    ],
    SOC_ADMIN: [
      "MARK_FALSE_POSITIVE",
      "CONFIRM_MALICIOUS",
      "RELEASE_EMAIL",
      "BLOCK_SENDER",
    ],
  };

  return roleMatrix[user.role]?.includes(permission);
}

/* =========================================================
   Backend-aligned types
   ========================================================= */

type AlertAnalysis = {
  risk: {
    score: number;
    verdict: string;
    reasons: string[];
  };
  nlp_analysis: {
    available: boolean;
    signals: string[];
  };
  url_analysis: {
    score: number;
    signals: string[];
  };
  email_text_analysis: {
    score: number;
    signals: string[];
  };
  malware_analysis: {
    detected: boolean;
    engine: string;
  };
};

type AlertDetail = {
  id: string;
  sender: string;
  subject: string;
  body: string;
  urls: string[];
  attachments: { name: string; hash: string }[];
  risk_score: number;
  verdict: string;
  severity: "COLD" | "WARM" | "HOT";
  status: string;
  created_at: string;
  assigned_analyst?: string | null;
  analysis: AlertAnalysis;
};

type AuditLog = {
  id: string;
  action: string;
  performed_by: string;
  notes?: string;
  timestamp: string;
};

type AlertAction =
  | "FALSE_POSITIVE"
  | "CONFIRM_MALICIOUS"
  | "RELEASE"
  | "BLOCK_SENDER";

/* =========================================================
   Component
   ========================================================= */

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [alert, setAlert] = useState<AlertDetail | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  /* =========================
     Fetch alert + audit logs
     ========================= */
  const fetchAlert = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [alertRes, logsRes] = await Promise.all([
        api.get<{ data: AlertDetail }>(`/alerts/${id}`),
        api.get<{ data: AuditLog[] }>(`/alerts/${id}/audit-logs`),
      ]);
      setAlert(alertRes.data);
      setAuditLogs(logsRes.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlert();
  }, [id]);

  /* =========================
     Action handler (RBAC + ID)
     ========================= */
  async function handleAction(action: AlertAction) {
    if (!alert || !user) return;

    try {
      setActionLoading(true);

      await api.post(`/alerts/${alert.id}/action`, {
        action,
        acted_by: {
          user_id: user.id,
          email: user.email,
          role: user.role,
        },
      });

      await fetchAlert();
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  }

  /* =========================
     Render states
     ========================= */
  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading alert…</div>;
  }

  if (error || !alert) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Alert not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/alerts")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold truncate">
              {alert.subject}
            </h1>
            <SeverityBadge severity={alert.severity} />
            <VerdictBadge verdict={alert.verdict} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {alert.id} •{" "}
            {formatDistanceToNow(new Date(alert.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          {/* Email Evidence */}
          <div className="soc-card">
            <h2 className="soc-card-header flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Evidence
            </h2>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">From</span>
                  <p className="font-mono break-all">{alert.sender}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Received</span>
                  <p>{format(new Date(alert.created_at), "PPpp")}</p>
                </div>
              </div>

              <Separator />

              <pre className="p-4 bg-muted/30 rounded-lg text-sm whitespace-pre-wrap font-mono">
                {alert.body}
              </pre>
            </div>
          </div>

          {/* Audit Log */}
          <div className="soc-card">
            <h2 className="soc-card-header flex items-center gap-2">
              <Clock className="h-4 w-4" /> Audit Log
            </h2>

            <div className="mt-4 space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-sm">
                  <strong>{log.performed_by}</strong>{" "}
                  <span className="text-muted-foreground">
                    {log.action.replace(/_/g, " ").toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div className="soc-card">
            <h2 className="soc-card-header">Risk</h2>
            <RiskScoreGauge score={alert.risk_score} size="lg" />
          </div>

          <div className="soc-card">
            <h2 className="soc-card-header">Actions</h2>

            <div className="space-y-2 mt-3">
              {can(user, "MARK_FALSE_POSITIVE") && (
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={actionLoading}
                  onClick={() => handleAction("FALSE_POSITIVE")}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Mark False Positive
                </Button>
              )}

              {can(user, "CONFIRM_MALICIOUS") && (
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={actionLoading}
                  onClick={() => handleAction("CONFIRM_MALICIOUS")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Malicious
                </Button>
              )}

              {alert.severity === "HOT" &&
                can(user, "RELEASE_EMAIL") && (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={actionLoading}
                    onClick={() => handleAction("RELEASE")}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Release Email
                  </Button>
                )}

              {can(user, "BLOCK_SENDER") && (
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={actionLoading}
                  onClick={() => handleAction("BLOCK_SENDER")}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Block Sender
                </Button>
              )}
            </div>
          </div>

          <div className="soc-card">
            <h2 className="soc-card-header">Assigned Analyst</h2>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              {alert.assigned_analyst ?? "Unassigned"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
