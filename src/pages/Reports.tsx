import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { kpiData, trendData } from '@/data/mockData';
import {
  Download,
  FileText,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const severityDistribution = [
  { name: 'Cold', value: kpiData.coldCount, color: 'hsl(142, 76%, 45%)' },
  { name: 'Warm', value: kpiData.warmCount, color: 'hsl(38, 92%, 50%)' },
  { name: 'Hot', value: kpiData.hotCount, color: 'hsl(0, 84%, 60%)' },
];

export default function Reports() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [analystFilter, setAnalystFilter] = useState('ALL');

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate and export security reports for audits and management
        </p>
      </div>

      {/* Filters Card */}
      <div className="soc-card">
        <h2 className="soc-card-header">Report Filters</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal bg-card border-border',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal bg-card border-border',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Severity</Label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="ALL">All Severities</SelectItem>
                <SelectItem value="HOT">Hot only</SelectItem>
                <SelectItem value="WARM">Warm only</SelectItem>
                <SelectItem value="COLD">Cold only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Analyst */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Analyst</Label>
            <Select value={analystFilter} onValueChange={setAnalystFilter}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="ALL">All Analysts</SelectItem>
                <SelectItem value="sarah">Sarah Chen</SelectItem>
                <SelectItem value="john">John Martinez</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="soc-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total Emails</p>
              <p className="text-2xl font-semibold font-mono">{kpiData.emailsScanned24h.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="soc-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-severity-hot/10">
              <TrendingUp className="h-5 w-5 text-severity-hot" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Threats Blocked</p>
              <p className="text-2xl font-semibold font-mono">{kpiData.blockedEmails}</p>
            </div>
          </div>
        </div>

        <div className="soc-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-severity-cold/10">
              <PieChart className="h-5 w-5 text-severity-cold" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Detection Rate</p>
              <p className="text-2xl font-semibold font-mono">99.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="soc-card">
          <h2 className="soc-card-header">Severity Distribution</h2>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 10%)',
                    border: '1px solid hsl(217, 33%, 18%)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="soc-card">
          <h2 className="soc-card-header">Period Summary</h2>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Total alerts generated</span>
              <span className="font-mono font-semibold">{kpiData.warmCount + kpiData.hotCount}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Alerts resolved</span>
              <span className="font-mono font-semibold">892</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Average response time</span>
              <span className="font-mono font-semibold">4m 32s</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">False positive rate</span>
              <span className="font-mono font-semibold text-severity-cold">0.3%</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-muted-foreground">Phishing campaigns detected</span>
              <span className="font-mono font-semibold">12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="soc-card">
        <h2 className="soc-card-header">Export Report</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Export Charts
          </Button>
        </div>
      </div>
    </div>
  );
}
