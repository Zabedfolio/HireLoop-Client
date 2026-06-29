'use client';

import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { updateJob, deleteJob } from '@/lib/actions/job';
import { Magnifier, Suitcase, MapPin, CircleDollar, TrashBin, Lock, LockOpen, OpenBook } from '@gravity-ui/icons';

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

export default function AdminJobsClient({ initialJobs = [] }) {
    const [jobs, setJobs] = useState(initialJobs);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleToggleStatus = async (job) => {
        const id = job._id || job.id;
        const currentStatus = job.status || 'active';
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';

        try {
            await updateJob(id, { status: newStatus });
            setJobs(prev => prev.map(j => j._id === id ? { ...j, status: newStatus } : j));
            toast.success(`Job listing is now ${newStatus}`);
        } catch (error) {
            console.error('Toggle status error:', error);
            toast.error('Failed to change status');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (confirm('Are you sure you want to permanently delete this job listing?')) {
            try {
                await deleteJob(jobId);
                setJobs(prev => prev.filter(j => j._id !== jobId));
                toast.success('Job listing deleted successfully');
            } catch (error) {
                console.error('Delete job error:', error);
                toast.error('Failed to delete job');
            }
        }
    };

    const formatSalary = (min, max, currency = 'USD') => {
        const fmt = (n) => {
            const num = Number(n);
            if (!num) return null;
            return num >= 1000
                ? `${currency === 'USD' ? '$' : currency}${(num / 1000).toFixed(0)}k`
                : `${currency === 'USD' ? '$' : currency}${num}`;
        };
        const lo = fmt(min), hi = fmt(max);
        if (lo && hi) return `${lo} – ${hi}`;
        if (hi) return `Up to ${hi}`;
        if (lo) return `From ${lo}`;
        return '—';
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(j => {
            const matchesSearch =
                (j.job_title?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
                (j.companyName?.toLowerCase() ?? '').includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [jobs, search, statusFilter]);

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 24 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Admin</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Job Moderation</h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Monitor, close, or delete job postings across the network.</p>
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: '1 1 280px' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.text3 }}><Magnifier width={14} height={14} /></span>
                    <input
                        type="text"
                        placeholder="Search roles or companies..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 34px', borderRadius: 10,
                            background: T.bg1, border: `1px solid ${T.border}`, color: T.text1, outline: 'none', fontSize: 13
                        }}
                    />
                </div>

                {/* Status select */}
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{
                        padding: '10px 14px', borderRadius: 10, background: T.bg1, border: `1px solid ${T.border}`,
                        color: T.text2, outline: 'none', fontSize: 13, cursor: 'pointer'
                    }}
                >
                    <option value="all">All Listings</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            {/* Table */}
            {filteredJobs.length === 0 ? (
                <div style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: '60px 20px', textAlign: 'center', background: T.bg1 }}>
                    <p style={{ margin: 0, fontSize: 13, color: T.text3 }}>No job listings registered.</p>
                </div>
            ) : (
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                                    {['Job details', 'Company', 'Location', 'Salary', 'Date posted', 'Status', 'Actions'].map((h, i) => (
                                        <th key={h} style={{ padding: '9px 20px', textAlign: i === 6 ? 'right' : 'left', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map((j) => {
                                    const dateStr = j.createAt ? new Date(j.createAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                                    const isActive = j.status === 'active';

                                    return (
                                        <tr key={j._id} style={{ borderBottom: `1px solid ${T.border}` }}>
                                            
                                            {/* Job details */}
                                            <td style={{ padding: '13px 20px' }}>
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text1 }}>{j.job_title}</p>
                                                <span style={{ display: 'inline-flex', marginTop: 4, borderRadius: 4, background: 'rgba(255,255,255,0.03)', padding: '1px 5px', fontSize: 10, color: T.text2 }}>
                                                    {j.job_type?.replace(/_/g, ' ')}
                                                </span>
                                            </td>

                                            {/* Company */}
                                            <td style={{ padding: '13px 20px', fontSize: 12.5, color: T.text1 }}>{j.companyName}</td>

                                            {/* Location */}
                                            <td style={{ padding: '13px 20px', fontSize: 12, color: T.text2 }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin width={11} height={11} /> {j.location || 'Remote'}</span>
                                            </td>

                                            {/* Salary */}
                                            <td style={{ padding: '13px 20px', fontSize: 12, color: T.green, fontWeight: 600 }}>
                                                {formatSalary(j.min_salary, j.max_salary, j.currency)}
                                            </td>

                                            {/* Date Posted */}
                                            <td style={{ padding: '13px 20px', fontSize: 12, color: T.text3 }}>{dateStr}</td>

                                            {/* Status */}
                                            <td style={{ padding: '13px 20px' }}>
                                                <span style={{
                                                    borderRadius: 6, fontSize: 10, fontWeight: 600, padding: '2px 7px', textTransform: 'uppercase',
                                                    background: isActive ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                                                    color: isActive ? T.green : T.red
                                                }}>
                                                    {j.status || 'Active'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '10px 20px', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: 6 }}>
                                                    <button
                                                        onClick={() => handleToggleStatus(j)}
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', borderRadius: 8,
                                                            background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`,
                                                            color: T.text2, padding: '5px 10px', fontSize: 11, fontWeight: 600,
                                                            cursor: 'pointer', transition: 'background 0.15s, color 0.15s'
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = T.text1; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = T.text2; }}
                                                    >
                                                        {isActive ? <Lock width={10} height={10} /> : <LockOpen width={10} height={10} />}
                                                        {isActive ? 'Close' : 'Reopen'}
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteJob(j._id)}
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', justifyItems: 'center', gap: 4, border: 'none', borderRadius: 8,
                                                            background: 'rgba(248,113,113,0.08)',
                                                            color: T.red, padding: '5px 9px', fontSize: 11, fontWeight: 600,
                                                            cursor: 'pointer', transition: 'background 0.15s'
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.13)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                                                    >
                                                        <TrashBin width={11} height={11} />
                                                    </button>
                                                </div>
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
