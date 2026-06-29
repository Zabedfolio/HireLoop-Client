import { serverFetch } from "../core/server";

export const getMySubscriptions = async (email) => {
    if (!email) return [];
    return serverFetch(`/api/my/subscriptions?email=${email}`);
};

export const getAdminPaymentsSummary = async () => {
    return serverFetch(`/api/admin/payments`);
};
