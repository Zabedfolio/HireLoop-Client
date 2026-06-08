import { serverFetch } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session.js";

export const getRecruiterCompany = async (recruiter_id) => {
    return serverFetch(`/api/my/companies?recruiter_id=${recruiter_id}`);
}


export const getLoggedInRecruiterCompany = async () => {
    const user = await getUserSession()
    return getRecruiterCompany(user?.id);
}