import NewJob from '@/app/dashboard/recruiter/jobs/new/NewJob';
import React from 'react';
import { getLoggedInRecruiterCompany } from '@/lib/api/companies.js';

const PostJobPage = async() => {

    const company = await getLoggedInRecruiterCompany();

    return (
        <div>
            <NewJob company={company}></NewJob>
        </div>
    );
};

export default PostJobPage;