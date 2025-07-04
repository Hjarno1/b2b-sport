'use client';

import { useState } from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { useAuth } from '@/lib/context/auth-context';
import { UserRole } from '@/lib/data/mock-data';
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
  Settings as SettingsIcon,
} from 'lucide-react';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const roleKeyMap: Record<UserRole, string> = {
    [UserRole.ClubAdmin]: 'club_roles.club_admin',
    [UserRole.ClubStaff]: 'club_roles.club_staff',
    [UserRole.ClubFinance]: 'club_roles.club_finance',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{t('settings.settings')}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {t('settings.manage_desc', 'Manage your account settings and preferences')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<User size={16} />}
            label={t('settings.profile')}
          />
          <TabButton
            active={activeTab === 'account'}
            onClick={() => setActiveTab('account')}
            icon={<Lock size={16} />}
            label={t('settings.account')}
          />
          <TabButton
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
            icon={<Bell size={16} />}
            label={t('settings.notifications')}
          />
          <TabButton
            active={activeTab === 'preferences'}
            onClick={() => setActiveTab('preferences')}
            icon={<Globe size={16} />}
            label={t('settings.preferences')}
          />
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{t('settings.profile_info')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('settings.update_profile_desc')}</p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={user?.avatar || '/faces/default-avatar.jpg'}
                        alt={user?.name || t('settings.profile')}
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
                  {t('settings.change_avatar')}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('settings.name')}
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
                    {t('settings.email')}
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
                    {t('settings.role')}
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    defaultValue={user?.role ? t(roleKeyMap[user.role]) : ''}
                    disabled
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm bg-gray-50 text-gray-500 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">{t('settings.cannot_change_role')}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  {t('settings.save_changes')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {t('settings.account_security')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t(
                    'settings.account_security_desc',
                    'Update your password and configure security settings.',
                  )}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <Shield size={20} className="text-primary" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      {t('settings.account_protection')}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('settings.account_protection_desc')}
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
                    {t('settings.current_password')}
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
                    {t('settings.new_password')}
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
                    {t('settings.confirm_password')}
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
                <h4 className="text-sm font-medium text-gray-700">
                  {t('settings.two_factor_auth', 'Two-Factor Authentication')}
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        {t('settings.auth_app')}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.auth_app_desc')}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center mr-3">
                        <Check size={12} className="mr-1" /> {t('settings.enabled')}
                      </span>
                      <button className="text-sm text-primary font-medium hover:underline">
                        {t('settings.manage')}
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Shield size={16} className="text-green-600" />
                      </div>
                      <div className="text-xs text-gray-500">{t('settings.2fa_desc')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-medium text-gray-700">{t('settings.sessions')}</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        {t('settings.current_session')}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.session_started')}</p>
                    </div>
                    <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  {t('settings.update_password')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {t('settings.notification_settings')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{t('settings.notification_desc')}</p>
              </div>

              <div className="space-y-4">
                <NotificationOption
                  id="new-agreements"
                  title={t('settings.new_agreements')}
                  description={t('settings.new_agreements_desc')}
                  defaultChecked={true}
                />

                <NotificationOption
                  id="order-updates"
                  title={t('settings.order_updates')}
                  description={t('settings.order_updates_desc')}
                  defaultChecked={true}
                />

                <NotificationOption
                  id="system-updates"
                  title={t('settings.system_updates')}
                  description={t('settings.system_updates_desc')}
                  defaultChecked={true}
                />

                <NotificationOption
                  id="staff-changes"
                  title={t('settings.staff_changes')}
                  description={t('settings.staff_changes_desc')}
                  defaultChecked={false}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  {t('settings.notification_channels')}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        {t('settings.email_notifications')}
                      </span>
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
                      <span className="text-sm text-gray-700">
                        {t('settings.push_notifications')}
                      </span>
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
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  {t('settings.digest_frequency')}
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <RadioOption
                    id="digest-daily"
                    name="digest"
                    label={t('settings.daily')}
                    description={t('settings.daily_desc')}
                    defaultChecked={true}
                  />
                  <RadioOption
                    id="digest-weekly"
                    name="digest"
                    label={t('settings.weekly')}
                    description={t('settings.weekly_desc')}
                  />
                  <RadioOption
                    id="digest-off"
                    name="digest"
                    label={t('settings.off')}
                    description={t('settings.off_desc')}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  {t('settings.save_changes')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{t('settings.preferences')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('settings.enable_dark_mode')}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{t('settings.dark_mode')}</h4>
                    <p className="text-xs text-gray-500 mt-1">{t('settings.enable_dark_mode')}</p>
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
                    {t('settings.language')}
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Languages size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="language"
                      name="language"
                      value={i18n.language}
                      onChange={(e) => i18n.changeLanguage(e.target.value)}
                      className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm pr-10 appearance-none"
                    >
                      <option value="en">English</option>
                      <option value="da">Dansk</option>
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
                    {t('settings.timezone', 'Timezone')}
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
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    {t('settings.landing_page')}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <RadioOption
                      id="landing-dashboard"
                      name="landing"
                      label={t('settings.landing_dashboard')}
                      description={t('settings.landing_dashboard_desc')}
                      defaultChecked={true}
                    />
                    <RadioOption
                      id="landing-clubs"
                      name="landing"
                      label={t('settings.landing_clubs')}
                      description={t('settings.landing_clubs_desc')}
                    />
                    <RadioOption
                      id="landing-agreements"
                      name="landing"
                      label={t('settings.landing_agreements')}
                      description={t('settings.landing_agreements_desc')}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium flex items-center">
                  <Save size={16} className="mr-2" />
                  {t('settings.save_preferences')}
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
