import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getAllJobs } from '@/lib/api/jobs';
import AdminJobsClient from '@/components/dashboard/admin/AdminJobsClient';

const AdminJobsPage = async () => {
    // Validate admin role
    await requireRole('admin');
    
    // Fetch all listings
    const jobs = await getAllJobs() || [];

    return <AdminJobsClient initialJobs={jobs} />;
};

export default AdminJobsPage;
