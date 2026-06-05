const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

export const getCompanyJobs = async (companyId, status='active') => {
    const res = await fetch(`${baseurl}/api/jobs?companyId=${companyId}&status=${status}`);
    return res.json();
}