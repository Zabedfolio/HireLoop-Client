import CompanyProfile from '@/app/dashboard/recruiter/company/CompanyProfile';
import React from 'react';
import { getUserSession } from '@/lib/core/session.js';
import { getRecruiterCompany } from '@/lib/api/companies.js';

const CompanyPage = async () => {


  const user = await getUserSession();

  const company = await getRecruiterCompany(user?.id);
  console.log('User session in CompanyPage:', user);
  console.log('Company data:', company);

  return (
    <div>
      <CompanyProfile recruiter={user} recruiterCompany={company}></CompanyProfile>
    </div>
  );
};

export default CompanyPage;