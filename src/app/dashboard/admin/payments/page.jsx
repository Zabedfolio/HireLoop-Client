import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getAdminPaymentsSummary } from '@/lib/api/subscriptions';
import AdminPaymentsClient from '@/components/dashboard/admin/AdminPaymentsClient';

const AdminPaymentsPage = async () => {
    // Validate admin session
    await requireRole('admin');

    // Fetch payments summary
    const summary = await getAdminPaymentsSummary() || {};

    return <AdminPaymentsClient summary={summary} />;
};

export default AdminPaymentsPage;
