import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getRecruiterStats } from '@/lib/api/stats';
import RecruiterHomeClient from '@/components/dashboard/recruiter/RecruiterHomeClient';

const RecruiterDashboardHomePage = async () => {
    const user = await requireRole('recruiter');
    const stats = await getRecruiterStats(user.id);

    return <RecruiterHomeClient stats={stats} user={user} />;
};

export default RecruiterDashboardHomePage;