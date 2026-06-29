'use server';

import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const updateUserDetailsByAdmin = async (userId, data) => {
    const result = await serverMutation(`/api/admin/users/${userId}`, data, 'PATCH');
    revalidatePath('/dashboard/admin/users');
    return result;
};
