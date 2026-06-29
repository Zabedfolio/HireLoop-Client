import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getJobById } from '@/lib/api/jobs';
import { getApplicationsByJobId } from '@/lib/api/applications';
import RecruiterApplicantsClient from '@/components/dashboard/recruiter/jobs/RecruiterApplicantsClient';

const JobApplicantsPage = async (props) => {
    // Wait for the route params to resolve in Next.js 16/15
    const params = await props.params;
    const jobId = params.jobId;

    // Validate recruiter role
    await requireRole('recruiter');

    // Load data
    const job = await getJobById(jobId) || {};
    const applicants = await getApplicationsByJobId(jobId) || [];

    return (
        <RecruiterApplicantsClient
            initialApplicants={applicants}
            job={job}
        />
    );
};

export default JobApplicantsPage;
