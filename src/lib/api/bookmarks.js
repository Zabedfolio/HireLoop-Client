import { serverFetch } from "../core/server";

export const getUserBookmarks = async (userId) => {
    if (!userId) return [];
    return serverFetch(`/api/bookmarks?userId=${userId}`);
};
