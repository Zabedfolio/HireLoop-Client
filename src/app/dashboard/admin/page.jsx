import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getAdminStats } from '@/lib/api/stats';
import AdminHomeClient from '@/components/dashboard/admin/AdminHomeClient';

const AdminDashboardHomePage = async () => {
    // Verifies admin role
    await requireRole('admin');
    
    // Fetch dashboard stats
    const stats = await getAdminStats() || {};

    return <AdminHomeClient stats={stats} />;
};

export default AdminDashboardHomePage;