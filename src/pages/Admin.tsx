import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Users,
  Shield,
  Bell,
  Key,
  Database,
  AlertTriangle,
  Plus,
  Trash2,
  Mail,
} from 'lucide-react';
import { currentUser } from '@/data/mockData';

const blockedDomains = [
  { domain: 'malicious-site.ru', addedBy: 'John Martinez', date: '2024-01-20' },
  { domain: 'phishing-attack.xyz', addedBy: 'Sarah Chen', date: '2024-01-22' },
  { domain: 'fake-login.com', addedBy: 'System', date: '2024-01-25' },
];

const analysts = [
  { name: 'Sarah Chen', email: 'sarah.chen@acme.com', role: 'analyst', status: 'active' },
  { name: 'John Martinez', email: 'john.martinez@acme.com', role: 'analyst', status: 'active' },
  { name: 'Admin User', email: 'admin@acme.com', role: 'admin', status: 'active' },
];

export default function Admin() {
  const [newDomain, setNewDomain] = useState('');

  // Role gate
  if (currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground mt-2">
            Admin privileges required to access this section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          System configuration and user management
        </p>
      </div>

      <Tabs defaultValue="blocklist" className="space-y-6">
        <TabsList className="bg-muted/30 border border-border">
          <TabsTrigger value="blocklist" className="gap-2 data-[state=active]:bg-card">
            <Shield className="h-4 w-4" />
            Blocklist
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-card">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-card">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2 data-[state=active]:bg-card">
            <Key className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* Blocklist Tab */}
        <TabsContent value="blocklist" className="space-y-6">
          <div className="soc-card">
            <h2 className="soc-card-header">Blocked Domains & Senders</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Emails from these domains are automatically blocked and quarantined.
            </p>

            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Enter domain to block (e.g., malware.com)"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="bg-muted/30 border-border"
              />
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="mt-6 space-y-2">
              {blockedDomains.map((item) => (
                <div
                  key={item.domain}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-mono text-sm text-foreground">{item.domain}</p>
                    <p className="text-xs text-muted-foreground">
                      Added by {item.addedBy} on {item.date}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="soc-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="soc-card-header">Team Members</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage SOC analysts and administrators.
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Invite User
              </Button>
            </div>

            <div className="mt-6 space-y-2">
              {analysts.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Badge className="severity-cold">{user.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="soc-card">
            <h2 className="soc-card-header">Alert Notifications</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure how and when you receive security alerts.
            </p>

            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-foreground">Email notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-foreground">HOT alerts only</Label>
                  <p className="text-xs text-muted-foreground">Only notify for high-risk threats</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-foreground">Slack integration</Label>
                  <p className="text-xs text-muted-foreground">Post alerts to Slack channel</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-foreground">Daily digest</Label>
                  <p className="text-xs text-muted-foreground">Receive a daily summary report</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="soc-card">
            <h2 className="soc-card-header">API & Integrations</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage API keys and third-party integrations.
            </p>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Email Gateway</p>
                    <p className="text-xs text-muted-foreground">Microsoft 365 connected</p>
                  </div>
                  <Badge className="severity-cold">Connected</Badge>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">SIEM Integration</p>
                    <p className="text-xs text-muted-foreground">Send alerts to your SIEM</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Threat Intelligence</p>
                    <p className="text-xs text-muted-foreground">External threat feeds</p>
                  </div>
                  <Badge className="severity-cold">Active</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="soc-card">
            <h2 className="soc-card-header">API Keys</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage API keys for programmatic access.
            </p>

            <div className="mt-4">
              <Button variant="outline" className="gap-2">
                <Key className="h-4 w-4" />
                Generate New API Key
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
