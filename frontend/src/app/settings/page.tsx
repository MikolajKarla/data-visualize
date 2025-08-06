'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { Settings, Bell, Globe, Palette, Shield, Moon, Sun } from 'lucide-react'

export default function SettingsPage() {
  const { user, isAuthenticated, refreshUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications_enabled: true,
    language: 'pl',
    email_notifications: true,
    push_notifications: false,
    marketing_emails: false,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    if (user?.settings) {
      setSettings({
        theme: user.settings.theme || 'light',
        notifications_enabled: user.settings.notifications_enabled ?? true,
        language: user.settings.language || 'pl',
        email_notifications: true,
        push_notifications: false,
        marketing_emails: false,
      })
    }
  }, [isAuthenticated, user, router])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuth.getState().token}`,
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        await refreshUser()
      }
    } catch (error) {
      console.error('Settings update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const SettingSection = ({ title, description, children }: { 
    title: string
    description: string
    children: React.ReactNode 
  }) => (
    <div className="p-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="ml-6">
          {children}
        </div>
      </div>
    </div>
  )

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-gray-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ustawienia</h1>
                <p className="text-gray-600">Zarządzaj preferencjami swojego konta</p>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="divide-y divide-gray-200">
            {/* Appearance */}
            <SettingSection
              title="Wygląd"
              description="Dostosuj motyw i wygląd aplikacji"
            >
              <div className="flex items-center space-x-3">
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="light">Jasny</option>
                  <option value="dark">Ciemny</option>
                  <option value="system">Systemowy</option>
                </select>
                {settings.theme === 'light' && <Sun className="w-5 h-5 text-yellow-500" />}
                {settings.theme === 'dark' && <Moon className="w-5 h-5 text-blue-500" />}
                {settings.theme === 'system' && <Palette className="w-5 h-5 text-gray-500" />}
              </div>
            </SettingSection>

            {/* Language */}
            <SettingSection
              title="Język"
              description="Wybierz preferowany język interfejsu"
            >
              <div className="flex items-center space-x-3">
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pl">Polski</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
                <Globe className="w-5 h-5 text-gray-500" />
              </div>
            </SettingSection>

            {/* Notifications */}
            <SettingSection
              title="Powiadomienia"
              description="Kontroluj, jakie powiadomienia chcesz otrzymywać"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Wszystkie powiadomienia</span>
                  </div>
                  <Toggle
                    checked={settings.notifications_enabled}
                    onChange={(checked) => setSettings({ ...settings, notifications_enabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between ml-8">
                  <span className="text-sm text-gray-700">Powiadomienia email</span>
                  <Toggle
                    checked={settings.email_notifications}
                    onChange={(checked) => setSettings({ ...settings, email_notifications: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between ml-8">
                  <span className="text-sm text-gray-700">Powiadomienia push</span>
                  <Toggle
                    checked={settings.push_notifications}
                    onChange={(checked) => setSettings({ ...settings, push_notifications: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between ml-8">
                  <span className="text-sm text-gray-700">Emaile marketingowe</span>
                  <Toggle
                    checked={settings.marketing_emails}
                    onChange={(checked) => setSettings({ ...settings, marketing_emails: checked })}
                  />
                </div>
              </div>
            </SettingSection>

            {/* Privacy & Security */}
            <SettingSection
              title="Prywatność i bezpieczeństwo"
              description="Zarządzaj ustawieniami prywatności i bezpieczeństwa"
            >
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Zmień hasło
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                >
                  Usuń konto
                </Button>
              </div>
            </SettingSection>
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
