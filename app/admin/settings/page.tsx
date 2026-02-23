import Link from 'next/link';
import { KeyRound } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">admin@admin.com</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Role</label>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">Super Admin</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
        <Link
          href="/admin/settings/change-password"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition"
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Configuration</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          System configuration options will appear here. Connect your Supabase project to manage settings.
        </p>
      </div>
    </div>
  );
}
