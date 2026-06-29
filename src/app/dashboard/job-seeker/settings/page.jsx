import React from 'react';
import { requireRole } from '@/lib/core/session';
import SeekerSettingsClient from '@/components/dashboard/job-seeker/SeekerSettingsClient';

const SettingsPage = async () => {
    const user = await requireRole('job_seeker');

    return <SeekerSettingsClient user={user} />;
};

export default SettingsPage;