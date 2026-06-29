'use server';

import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const addBookmark = async (userId, jobId) => {
    const result = await serverMutation('/api/bookmarks', { userId, jobId });
    revalidatePath('/dashboard/job-seeker/saved-jobs');
    return result;
};

export const deleteBookmark = async (userId, jobId) => {
    const result = await serverMutation(`/api/bookmarks?userId=${userId}&jobId=${jobId}`, null, 'DELETE');
    revalidatePath('/dashboard/job-seeker/saved-jobs');
    return result;
};
