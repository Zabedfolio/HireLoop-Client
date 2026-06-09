import { serverFetch } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session";

export const getRecruiterCompany = async (recruiter_id) => {
    if (!recruiter_id) {
        return null;
    }
    return serverFetch(`/api/my/companies?recruiter_id=${recruiter_id}`);
}

export const getLoggedInRecruiterCompany = async () => {
    const user = await getUserSession()
    return getRecruiterCompany(user?.id);
}