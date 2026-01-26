import { useState } from 'react';
import { AlertsTable } from '@/components/soc/AlertsTable';
import { alerts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Severity, AlertStatus } from '@/types/soc';

export default function Alerts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'ALL'>('ALL');

  // Filter out COLD alerts - they belong in Logs
  const nonColdAlerts = alerts.filter(a => a.severity !== 'COLD');

  const filteredAlerts = nonColdAlerts.filter((alert) => {
    const matchesSearch =
      alert.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.sender.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const openCount = nonColdAlerts.filter(a => a.status === 'OPEN').length;
  const hotOpenCount = nonColdAlerts.filter(a => a.severity === 'HOT' && a.status === 'OPEN').length;

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
        <Button variant="outline" size="sm" className="gap-2">
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
          
          <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as Severity | 'ALL')}>
            <SelectTrigger className="w-[130px] bg-card border-border">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="ALL">All Severity</SelectItem>
              <SelectItem value="HOT">Hot</SelectItem>
              <SelectItem value="WARM">Warm</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AlertStatus | 'ALL')}>
            <SelectTrigger className="w-[130px] bg-card border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="FALSE_POSITIVE">False Positive</SelectItem>
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
          <p className="text-muted-foreground">No alerts match your filters</p>
        </div>
      )}
    </div>
  );
}
