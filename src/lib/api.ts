// src/lib/api.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================================
   SCAN (REAL BACKEND)
================================ */

export async function scanEmail(payload: {
  sender: string;
  subject: string;
  body: string;
  urls?: string[];
  attachments?: any[];
}) {
  const res = await api.post("/scan/email", payload);
  return res.data;
}

/* ================================
   SOC ADAPTER (TEMP – SAFE)
================================ */

// Until backend persistence exists:
export async function fetchAlerts() {
  return {
    success: true,
    data: [], // empty alerts, no crash
  };
}

export async function fetchDashboard() {
  return {
    emails_scanned: 0,
    cold: 0,
    warm: 0,
    hot: 0,
    blocked: 0,
    false_positives: 0,
    trend: [],
  };
}

export async function fetchLogs() {
  return [];
}

export async function actOnAlert(
  alertId: string,
  action: string,
  user: any
) {
  // noop for now — backend endpoint not implemented yet
  console.warn("Action recorded (stub):", { alertId, action, user });
  return { success: true };
}
