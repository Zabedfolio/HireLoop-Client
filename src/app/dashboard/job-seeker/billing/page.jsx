import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getPlanById } from '@/lib/api/plans';
import { getApplicationsByApplicantId } from '@/lib/api/applications';
import { getMySubscriptions } from '@/lib/api/subscriptions';
import SeekerBillingClient from '@/components/dashboard/job-seeker/SeekerBillingClient';

const BillingPage = async () => {
    const user = await requireRole('job_seeker');
    
    // Fetch data
    const plan = await getPlanById(user.plan || 'seeker_free');
    const applications = await getApplicationsByApplicantId(user.id) || [];
    const subscriptions = await getMySubscriptions(user.email) || [];

    return (
        <SeekerBillingClient
            plan={plan}
            usageCount={applications.length}
            subscriptions={subscriptions}
            user={user}
        />
    );
};

export default BillingPage;