import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getPlanById } from '@/lib/api/plans';
import { getRecruiterStats } from '@/lib/api/stats';
import { getMySubscriptions } from '@/lib/api/subscriptions';
import RecruiterBillingClient from '@/components/dashboard/recruiter/RecruiterBillingClient';

const RecruiterBillingPage = async () => {
    const user = await requireRole('recruiter');

    // Fetch details
    const plan = await getPlanById(user.plan || 'recruiter_free');
    const stats = await getRecruiterStats(user.id);
    const subscriptions = await getMySubscriptions(user.email) || [];
    const activeJobsCount = stats?.activeJobs || 0;

    return (
        <RecruiterBillingClient
            plan={plan}
            usageCount={activeJobsCount}
            subscriptions={subscriptions}
            user={user}
        />
    );
};

export default RecruiterBillingPage;
