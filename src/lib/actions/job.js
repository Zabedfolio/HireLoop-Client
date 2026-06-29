'use server'

import { serverMutation } from "@/lib/core/server";

export const createJob = async (newJobData) => {
    return serverMutation('/api/jobs', newJobData);
}

export const updateJob = async (id, data) => {
    return serverMutation(`/api/jobs/${id}`, data, 'PATCH');
}

export const deleteJob = async (id) => {
    return serverMutation(`/api/jobs/${id}`, null, 'DELETE');
}