import { serverFetch } from "@/lib/core/server";

export const getRecruiterCompany = async (recruiter_id) => {
    return serverFetch(`/api/my/companies?recruiter_id=${recruiter_id}`);
}