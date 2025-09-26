"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Save, RefreshCw, Bell, Database, Activity, Mail } from "lucide-react"

export function AdminSettings() {
  const [settings, setSettings] = useState({
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,

    // Notification Settings
    emailNotifications: true,
    systemAlerts: true,
    userRegistrationNotifications: true,

    // Data Settings
    dataRefreshInterval: "15",
    maxCacheSize: "500",
    backupFrequency: "daily",

    // API Settings
    rateLimitEnabled: true,
    maxRequestsPerMinute: "1000",
    apiTimeout: "30",

    // Email Settings
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",

    // System Messages
    maintenanceMessage: "System is currently under maintenance. Please check back later.",
    welcomeMessage: "Welcome to PSX Intelligence - Your gateway to smart trading insights.",
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSaving(false)
  }

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground mt-1">Configure system settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">System Settings</CardTitle>
          </div>
          <CardDescription>Core system configuration and operational settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Debug Mode</Label>
                <p className="text-sm text-muted-foreground">Enable detailed logging</p>
              </div>
              <Switch
                checked={settings.debugMode}
                onCheckedChange={(checked) => handleInputChange("debugMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Cache Enabled</Label>
                <p className="text-sm text-muted-foreground">Enable system-wide caching</p>
              </div>
              <Switch
                checked={settings.cacheEnabled}
                onCheckedChange={(checked) => handleInputChange("cacheEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">Enable API rate limiting</p>
              </div>
              <Switch
                checked={settings.rateLimitEnabled}
                onCheckedChange={(checked) => handleInputChange("rateLimitEnabled", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Notification Settings</CardTitle>
          </div>
          <CardDescription>Configure system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send system notifications via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">System Alerts</Label>
                <p className="text-sm text-muted-foreground">Critical system alerts</p>
              </div>
              <Switch
                checked={settings.systemAlerts}
                onCheckedChange={(checked) => handleInputChange("systemAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">User Registration</Label>
                <p className="text-sm text-muted-foreground">Notify on new user registrations</p>
              </div>
              <Switch
                checked={settings.userRegistrationNotifications}
                onCheckedChange={(checked) => handleInputChange("userRegistrationNotifications", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Performance Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Data & Performance</CardTitle>
          </div>
          <CardDescription>Configure data refresh intervals and performance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dataRefresh">Data Refresh Interval (minutes)</Label>
              <Input
                id="dataRefresh"
                type="number"
                value={settings.dataRefreshInterval}
                onChange={(e) => handleInputChange("dataRefreshInterval", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cacheSize">Max Cache Size (MB)</Label>
              <Input
                id="cacheSize"
                type="number"
                value={settings.maxCacheSize}
                onChange={(e) => handleInputChange("maxCacheSize", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestLimit">Max Requests Per Minute</Label>
              <Input
                id="requestLimit"
                type="number"
                value={settings.maxRequestsPerMinute}
                onChange={(e) => handleInputChange("maxRequestsPerMinute", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiTimeout">API Timeout (seconds)</Label>
              <Input
                id="apiTimeout"
                type="number"
                value={settings.apiTimeout}
                onChange={(e) => handleInputChange("apiTimeout", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Email Configuration</CardTitle>
          </div>
          <CardDescription>Configure SMTP settings for system emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="smtpServer">SMTP Server</Label>
              <Input
                id="smtpServer"
                value={settings.smtpServer}
                onChange={(e) => handleInputChange("smtpServer", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                value={settings.smtpPort}
                onChange={(e) => handleInputChange("smtpPort", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="smtpUsername">SMTP Username</Label>
              <Input
                id="smtpUsername"
                type="email"
                value={settings.smtpUsername}
                onChange={(e) => handleInputChange("smtpUsername", e.target.value)}
                placeholder="your-email@domain.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Messages</CardTitle>
          <CardDescription>Configure user-facing system messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="maintenanceMsg">Maintenance Message</Label>
            <Textarea
              id="maintenanceMsg"
              value={settings.maintenanceMessage}
              onChange={(e) => handleInputChange("maintenanceMessage", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcomeMsg">Welcome Message</Label>
            <Textarea
              id="welcomeMsg"
              value={settings.welcomeMessage}
              onChange={(e) => handleInputChange("welcomeMessage", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">System Status</CardTitle>
          </div>
          <CardDescription>Current system configuration status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Maintenance Mode</span>
              <Badge variant={settings.maintenanceMode ? "destructive" : "default"}>
                {settings.maintenanceMode ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Cache System</span>
              <Badge variant={settings.cacheEnabled ? "default" : "secondary"}>
                {settings.cacheEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Rate Limiting</span>
              <Badge variant={settings.rateLimitEnabled ? "default" : "secondary"}>
                {settings.rateLimitEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
