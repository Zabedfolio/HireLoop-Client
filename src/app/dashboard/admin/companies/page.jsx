import AdminCompanyPage from '@/components/dashboard/admin/Admincompanypage';
import { getCompanies } from '@/lib/api/companies';

const AdminCompaniesPage = async () => {
  const companies = await getCompanies();

  return <AdminCompanyPage companies={companies} />;
};

export default AdminCompaniesPage;