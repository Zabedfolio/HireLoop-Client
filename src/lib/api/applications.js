import { serverFetch } from "../core/server"

export const getApplicationsByApplicantId = async (applicantId) => {
    return serverFetch(`/api/applications?applicantId=${applicantId}`)
}

export const getApplicationsByJobId = async (jobId) => {
    return serverFetch(`/api/applications?jobId=${jobId}`)
}