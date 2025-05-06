// src/app/(dashboard)/settings/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/context/auth-context';
import {
  Bell,
  Globe,
  Lock,
  User,
  Mail,
  Save,
  Moon,
  Sun,
  Camera,
  Shield,
  Key,
  Clock,
  Languages,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<User size={16} />}
            label="Profile"
          />
          <TabButton
            active={activeTab === 'account'}
            onClick={() => setActiveTab('account')}
            icon={<Lock size={16} />}
            label="Account"
          />
          <TabButton
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
            icon={<Bell size={16} />}
            label="Notifications"
          />
          <TabButton
            active={activeTab === 'preferences'}
            onClick={() => setActiveTab('preferences')}
            icon={<Globe size={16} />}
            label="Preferences"
          />
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your account profile information and email address.
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={user?.avatar || '/faces/default-avatar.jpg'}
                        alt={user?.name || 'User Avatar'}
                        layout="fill"
                        objectFit="cover"
                        priority
                      />
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 rounded-full bg-primary text-white p-1.5 shadow-sm border-2 border-white">
                    <Camera size={14} />
                  </button>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Change Avatar
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={user?.name}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={user?.email}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    defaultValue={user?.role}
                    disabled
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm bg-gray-50 text-gray-500 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Your role cannot be changed.</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Account Security</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your password and configure security settings.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <Shield size={20} className="text-primary" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Account Protection</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Your account is protected with two-factor authentication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="current-password"
                      id="current-password"
                      className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="new-password"
                      id="new-password"
                      className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Authenticator App</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Use an authenticator app to get verification codes
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center mr-3">
                        <Check size={12} className="mr-1" /> Enabled
                      </span>
                      <button className="text-sm text-primary font-medium hover:underline">
                        Manage
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Shield size={16} className="text-green-600" />
                      </div>
                      <div className="text-xs text-gray-500">
                        Two-factor authentication adds an extra layer of security to your account
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-medium text-gray-700">Sessions</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Current Session</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Started on Apr, 16, 2025 from Chrome on Windows
                      </p>
                    </div>
                    <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure how and when you receive notifications.
                </p>
              </div>

              <div className="space-y-4">
                <NotificationOption
                  id="new-agreements"
                  title="New Agreements"
                  description="Get notified when a new agreement is created"
                  defaultChecked={true}
                />

                <NotificationOption
                  id="order-updates"
                  title="Order Updates"
                  description="Receive notifications when orders change status"
                  defaultChecked={true}
                />

                <NotificationOption
                  id="system-updates"
                  title="System Updates"
                  description="Get notified about platform updates and maintenance"
                  defaultChecked={true}
                />

                <NotificationOption
                  id="staff-changes"
                  title="Staff Changes"
                  description="Be informed when staff are added or removed"
                  defaultChecked={false}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Email Notifications</span>
                    </div>
                    <div>
                      <Switch
                        checked={emailNotifications}
                        onChange={setEmailNotifications}
                        icon={<Mail size={12} />}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Push Notifications</span>
                    </div>
                    <div>
                      <Switch
                        checked={pushNotifications}
                        onChange={setPushNotifications}
                        icon={<Bell size={12} />}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Email Digest Frequency</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <RadioOption
                    id="digest-daily"
                    name="digest"
                    label="Daily"
                    description="Get a summary once a day"
                    defaultChecked={true}
                  />
                  <RadioOption
                    id="digest-weekly"
                    name="digest"
                    label="Weekly"
                    description="Get a summary once a week"
                  />
                  <RadioOption
                    id="digest-off"
                    name="digest"
                    label="Off"
                    description="Don't send email digests"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  Save Notification Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Interface Preferences</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customize your interface and application preferences.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                    <p className="text-xs text-gray-500 mt-1">Enable dark mode for the interface</p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onChange={setDarkMode}
                    icon={darkMode ? <Moon size={12} /> : <Sun size={12} />}
                  />
                </div>

                <div className="pt-4">
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Language
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Languages size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="language"
                      name="language"
                      className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm pr-10 appearance-none"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Timezone
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="timezone"
                      name="timezone"
                      className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm pr-10 appearance-none"
                    >
                      <option>UTC (Coordinated Universal Time)</option>
                      <option>EST (Eastern Standard Time)</option>
                      <option>CST (Central Standard Time)</option>
                      <option>MST (Mountain Standard Time)</option>
                      <option>PST (Pacific Standard Time)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Landing Page</h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <RadioOption
                      id="landing-dashboard"
                      name="landing"
                      label="Dashboard"
                      description="Start at the dashboard"
                      defaultChecked={true}
                    />
                    <RadioOption
                      id="landing-clubs"
                      name="landing"
                      label="Club Management"
                      description="Start at club management"
                    />
                    <RadioOption
                      id="landing-agreements"
                      name="landing"
                      label="Agreements"
                      description="Start at agreements"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      className={`whitespace-nowrap py-4 px-6 text-sm font-medium flex items-center border-b-2 transition-colors ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

interface NotificationOptionProps {
  id: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
}

function NotificationOption({
  id,
  title,
  description,
  defaultChecked = false,
}: NotificationOptionProps) {
  return (
    <div className="flex items-start p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
      <div className="flex h-5 items-center">
        <input
          id={id}
          name={id}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {title}
        </label>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}

interface RadioOptionProps {
  id: string;
  name: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function RadioOption({ id, name, label, description, defaultChecked = false }: RadioOptionProps) {
  return (
    <div className="relative flex items-start p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="radio"
          defaultChecked={defaultChecked}
          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}

function Switch({ checked, onChange, icon }: SwitchProps) {
  return (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-gray-200'
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      {icon && (
        <span className={`absolute ${checked ? 'left-1.5' : 'right-1.5'} text-white`}>{icon}</span>
      )}
    </button>
  );
}
