import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Search,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { currentUser } from '@/data/mockData';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts', badge: 5 },
  { to: '/investigate', icon: Search, label: 'Investigate' },
  { to: '/logs', icon: FileText, label: 'Logs' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

const adminItems = [
  { to: '/admin', icon: Settings, label: 'Admin' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'h-[calc(100vh-3.5rem)] bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              'nav-item',
              isActive(item.to) && 'nav-item-active'
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-severity-hot/20 text-severity-hot">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {currentUser.role === 'admin' && (
          <>
            <div className={cn('my-4 border-t border-sidebar-border', collapsed && 'mx-2')} />
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'nav-item',
                  isActive(item.to) && 'nav-item-active'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
