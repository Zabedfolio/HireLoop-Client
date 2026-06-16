import { serverFetch } from "../core/server"

export const getApplicationsByApplicantId = async (applicantId) => {
    return serverFetch(`/api/applications?applicantId=${applicantId}`)
}