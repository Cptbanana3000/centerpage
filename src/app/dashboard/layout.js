'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900">
        {/* A dashboard-specific navbar could be added here in the future */}
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
} 