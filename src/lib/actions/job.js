'use server'

import { serverMutation } from "@/lib/core/server";

export const createJob = async (newJobData) => {
    return serverMutation('/api/jobs', newJobData);
}