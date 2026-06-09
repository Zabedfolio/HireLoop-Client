import { getCompanyJobs } from '@/lib/api/jobs';
import RecruiterJobsClient from '@/components/dashboard/recruiter/jobs/RecruiterJobsClient';
import { getLoggedInRecruiterCompany } from '@/lib/api/companies';

const RecruiterJobs = async () => {
    const company = await getLoggedInRecruiterCompany();
    const jobs = company?._id ? await getCompanyJobs(company._id) : [];

    return <RecruiterJobsClient jobs={jobs} />;
};

export default RecruiterJobs;
