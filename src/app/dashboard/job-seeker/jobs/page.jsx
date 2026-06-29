import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getAllJobs } from '@/lib/api/jobs';
import { getUserBookmarks } from '@/lib/api/bookmarks';
import { getApplicationsByApplicantId } from '@/lib/api/applications';
import { getPlanById } from '@/lib/api/plans';
import SeekerJobsClient from '@/components/dashboard/job-seeker/SeekerJobsClient';

const SeekerJobsPage = async () => {
    const user = await requireRole('job_seeker');
    
    // Fetch dashboard items
    const jobs = await getAllJobs() || [];
    const bookmarks = await getUserBookmarks(user.id) || [];
    const applications = await getApplicationsByApplicantId(user.id) || [];
    const plan = await getPlanById(user.plan || 'seeker_free');

    return (
        <SeekerJobsClient
            jobs={jobs}
            initialBookmarks={bookmarks}
            initialApplications={applications}
            user={user}
            plan={plan}
        />
    );
};

export default SeekerJobsPage;