import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  Search,
  FileText,
  BarChart3,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Alerts", icon: AlertTriangle, path: "/alerts" },
  { label: "Investigate", icon: Search, path: "/investigate" },
  { label: "Logs", icon: FileText, path: "/logs" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-background">
      <nav className="p-4 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
               ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
