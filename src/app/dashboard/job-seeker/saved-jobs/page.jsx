import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getUserBookmarks } from '@/lib/api/bookmarks';
import { getApplicationsByApplicantId } from '@/lib/api/applications';
import { getPlanById } from '@/lib/api/plans';
import SeekerSavedJobsClient from '@/components/dashboard/job-seeker/SeekerSavedJobsClient';

const SavedJobPage = async () => {
    const user = await requireRole('job_seeker');
    
    // Fetch items
    const savedJobs = await getUserBookmarks(user.id) || [];
    const applications = await getApplicationsByApplicantId(user.id) || [];
    const plan = await getPlanById(user.plan || 'seeker_free');

    return (
        <SeekerSavedJobsClient
            savedJobs={savedJobs}
            initialApplications={applications}
            user={user}
            plan={plan}
        />
    );
};

export default SavedJobPage;