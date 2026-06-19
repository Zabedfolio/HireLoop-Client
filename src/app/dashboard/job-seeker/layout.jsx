import { requireRole } from '@/lib/core/session';
import React from 'react';

const SeekerLayout = async({children}) => {
    await requireRole('job_seeker')
    return children;
};

export default SeekerLayout;