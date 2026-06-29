import React from 'react';
import { requireRole } from '@/lib/core/session';
import { getAdminUsersList } from '@/lib/api/users';
import AdminUsersClient from '@/components/dashboard/admin/AdminUsersClient';

const AdminUsersPage = async () => {
    // Check admin role
    await requireRole('admin');
    
    // Fetch users list
    const users = await getAdminUsersList() || [];

    return <AdminUsersClient initialUsers={users} />;
};

export default AdminUsersPage;
