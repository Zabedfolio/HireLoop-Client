'use server'

import { serverMutation } from "../core/server"

export const submitApplication = async(applicationData)=>{
    return serverMutation(`/api/applications`, applicationData)
}

export const updateApplicationStatus = async (id, status) => {
    return serverMutation(`/api/applications/${id}`, { status }, 'PATCH');
}