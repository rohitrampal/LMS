'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import SuperAdminDashboard from '@/components/Dashboard/SuperAdminDashboard';
import BankAdminDashboard from '@/components/Dashboard/BankAdminDashboard';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import RegulatorDashboard from '@/components/Dashboard/RegulatorDashboard';
import BankEmployeeDashboard from '@/components/Dashboard/BankEmployeeDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!currentUser) return null;

  switch (currentUser.role) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'bank':
      return <BankAdminDashboard />;
    case 'regulator':
      return <RegulatorDashboard />;
    case 'bank_employee':
      return <BankEmployeeDashboard />;
    default:
      return null;
  }
}


