'use client';

import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { updateUserDetailsByAdmin } from '@/lib/actions/users';
import { Magnifier, Shield, ShieldCheck, User, Person, Lock, LockOpen } from '@gravity-ui/icons';

const T = {
    bg0: '#080809',
    bg1: '#0D0D0E',
    bg2: '#111113',
    border: 'rgba(255,255,255,0.07)',
    text1: '#f4f4f5',
    text2: '#a1a1aa',
    text3: '#52525b',
    blue: '#60a5fa',
    green: '#34d399',
    red: '#f87171',
    amber: '#fbbf24',
    violet: '#a78bfa',
};

const ROLE_OPTIONS = [
    { label: 'Job Seeker', value: 'job_seeker' },
    { label: 'Recruiter', value: 'recruiter' },
    { label: 'Administrator', value: 'admin' },
];

export default function AdminUsersClient({ initialUsers = [] }) {
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserDetailsByAdmin(userId, { role: newRole });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            toast.success(`User role updated to ${newRole.replace(/_/g, ' ')}`);
        } catch (error) {
            console.error('Update role error:', error);
            toast.error('Failed to update user role');
        }
    };

    const handleStatusToggle = async (user) => {
        const id = user._id;
        const currentStatus = user.status || 'active';
        const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';

        const actionText = newStatus === 'suspended' ? 'suspend' : 'activate';
        if (confirm(`Are you sure you want to ${actionText} this user account?`)) {
            try {
                await updateUserDetailsByAdmin(id, { status: newStatus });
                setUsers(prev => prev.map(u => u._id === id ? { ...u, status: newStatus } : u));
                toast.success(`Account has been set to ${newStatus}`);
            } catch (error) {
                console.error('Toggle status error:', error);
                toast.error('Failed to change user status');
            }
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch =
                (u.email?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
                (u.name?.toLowerCase() ?? '').includes(search.toLowerCase());
            const matchesRole = roleFilter === 'all' || u.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 24 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Admin</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Manage Users</h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Modify user roles and toggles for active or suspended credentials.</p>
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: '1 1 280px' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.text3 }}><Magnifier width={14} height={14} /></span>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 34px', borderRadius: 10,
                            background: T.bg1, border: `1px solid ${T.border}`, color: T.text1, outline: 'none', fontSize: 13
                        }}
                    />
                </div>

                {/* Role Filter Selector */}
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    style={{
                        padding: '10px 14px', borderRadius: 10, background: T.bg1, border: `1px solid ${T.border}`,
                        color: T.text2, outline: 'none', fontSize: 13, cursor: 'pointer'
                    }}
                >
                    <option value="all">All Roles</option>
                    <option value="job_seeker">Job Seekers</option>
                    <option value="recruiter">Recruiters</option>
                    <option value="admin">Administrators</option>
                </select>
            </div>

            {/* Table */}
            {filteredUsers.length === 0 ? (
                <div style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: '60px 20px', textAlign: 'center', background: T.bg1 }}>
                    <p style={{ margin: 0, fontSize: 13, color: T.text3 }}>No users match your query.</p>
                </div>
            ) : (
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                                    {['User details', 'Account Email', 'Assigned Role', 'Account Status', 'Actions'].map((h, i) => (
                                        <th key={h} style={{ padding: '9px 20px', textAlign: i === 4 ? 'right' : 'left', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => {
                                    const init = u.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '??';
                                    const isSuspended = u.status === 'suspended';

                                    return (
                                        <tr key={u._id} style={{ borderBottom: `1px solid ${T.border}` }}>
                                            
                                            {/* User details */}
                                            <td style={{ padding: '13px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                                                        <span style={{ margin: 'auto', fontSize: 11, fontWeight: 'bold', color: T.text2 }}>{init}</span>
                                                    </div>
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text1 }}>{u.name}</span>
                                                </div>
                                            </td>

                                            {/* Account Email */}
                                            <td style={{ padding: '13px 20px', fontSize: 12.5, color: T.text2 }}>{u.email}</td>

                                            {/* Role */}
                                            <td style={{ padding: '10px 20px' }}>
                                                <select
                                                    value={u.role || 'job_seeker'}
                                                    onChange={e => handleRoleChange(u._id, e.target.value)}
                                                    style={{
                                                        padding: '5px 9px', borderRadius: 8, background: T.bg2, border: `1px solid ${T.border}`,
                                                        color: u.role === 'admin' ? T.violet : u.role === 'recruiter' ? T.amber : T.text2,
                                                        outline: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                                                    }}
                                                >
                                                    {ROLE_OPTIONS.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '13px 20px' }}>
                                                <span style={{
                                                    borderRadius: 6, fontSize: 10, fontWeight: 600, padding: '2px 7px', textTransform: 'uppercase',
                                                    background: isSuspended ? 'rgba(248,113,113,0.08)' : 'rgba(52,211,153,0.08)',
                                                    color: isSuspended ? T.red : T.green
                                                }}>
                                                    {isSuspended ? 'Suspended' : 'Active'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '10px 20px', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => handleStatusToggle(u)}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', borderRadius: 8,
                                                        background: isSuspended ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                                                        color: isSuspended ? T.green : T.red, padding: '6px 12px', fontSize: 11.5, fontWeight: 600,
                                                        cursor: 'pointer', transition: 'background 0.15s'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = isSuspended ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = isSuspended ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)'}
                                                >
                                                    {isSuspended ? (
                                                        <>
                                                            <LockOpen width={11} height={11} />
                                                            Activate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock width={11} height={11} />
                                                            Suspend
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}
