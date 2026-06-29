import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getSeekerStats } from '@/lib/api/stats';
import { getApplicationsByApplicantId } from '@/lib/api/applications';
import SeekerHomeClient from '@/components/dashboard/job-seeker/SeekerHomeClient';

const JobSeekerDashboardHomePage = async () => {
    const user = await requireRole('job_seeker');
    const stats = await getSeekerStats(user.id);
    const applications = await getApplicationsByApplicantId(user.id);
    const recentApplications = Array.isArray(applications) ? applications.slice(0, 5) : [];

    return (
        <SeekerHomeClient 
            stats={stats} 
            user={user} 
            recentApplications={recentApplications} 
        />
    );
};

export default JobSeekerDashboardHomePage;