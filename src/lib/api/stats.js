import { serverFetch } from "../core/server";

export const getSeekerStats = async (userId) => {
    if (!userId) return null;
    return serverFetch(`/api/stats/seeker?userId=${userId}`);
};

export const getRecruiterStats = async (recruiterId) => {
    if (!recruiterId) return null;
    return serverFetch(`/api/stats/recruiter?recruiterId=${recruiterId}`);
};

export const getAdminStats = async () => {
    return serverFetch(`/api/stats/admin`);
};
