import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

import Dashboard from "@/pages/Dashboard";
import Alerts from "@/pages/Alerts";
import AlertDetail from "@/pages/AlertDetail";
import Investigate from "@/pages/Investigate";
import Logs from "@/pages/Logs";
import Reports from "@/pages/Reports";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/alerts/:id" element={<AlertDetail />} />
        <Route path="/investigate" element={<Investigate />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/reports" element={<Reports />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
