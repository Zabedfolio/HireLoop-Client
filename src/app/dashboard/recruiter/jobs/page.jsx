import { getCompanyJobs } from '@/lib/api/jobs';
import RecruiterJobsClient from '@/components/dashboard/recruiter/jobs/RecruiterJobsClient';

const RecruiterJobs = async () => {
    const companyId = 'company_123';
    const jobs = await getCompanyJobs(companyId);

    return <RecruiterJobsClient jobs={jobs} />;
};

export default RecruiterJobs;
