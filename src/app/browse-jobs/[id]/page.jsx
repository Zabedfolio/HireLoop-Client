import JobDetailsView from "@/components/Jobdetailsview";
import { getJobById } from "@/lib/api/jobs";

const JobDetailsPage = async ({ params }) => {
  const { id } = await params;
  const job = await getJobById(id);

  return <JobDetailsView job={job} />;
};

export default JobDetailsPage;