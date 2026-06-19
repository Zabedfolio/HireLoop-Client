import SeekerApplicationsClient from '@/components/dashboard/job-seeker/SeekerApplicationsClient';
import { getApplicationsByApplicantId } from '@/lib/api/applications';
import { getUserSession } from '@/lib/core/session';
import React from 'react';

const SeekerApplicationPage = async () => {
    const user = await getUserSession();
    const applications = await getApplicationsByApplicantId(user.id);

    return <SeekerApplicationsClient applications={applications} />;
};

export default SeekerApplicationPage;