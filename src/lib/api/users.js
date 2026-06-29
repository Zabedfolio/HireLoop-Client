import { serverFetch } from "../core/server";

export const getAdminUsersList = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.email) params.append('email', filters.email);
    if (filters.role) params.append('role', filters.role);
    return serverFetch(`/api/admin/users?${params.toString()}`);
};
