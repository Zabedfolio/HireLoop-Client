import { serverFetch } from "../core/server";

export const getPlanById = (planId)=>{
    return serverFetch(`/api/plans?plan_id=${planId}`);
}