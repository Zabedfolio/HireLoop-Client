'use server';

import { serverMutation } from "@/lib/core/server";


export const createCompany = async (newCompanyData) => {
    return serverMutation('/api/companies', newCompanyData);
}

// const baseurl = process.env.NEXT_PUBLIC_BASE_URL;
// export const createCompany = async (newCompanyData) => {
//     const res = await fetch(`${baseurl}/api/companies`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newCompanyData),
//     });
//     return res.json();
// };