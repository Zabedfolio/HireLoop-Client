'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Bookmark, FileText, Calendar, ShieldCheck, Gear } from '@gravity-ui/icons';

const T = {
    bg0: '#080809',
    bg1: '#0D0D0E',
    bg2: '#111113',
    border: 'rgba(255,255,255,0.07)',
    text1: '#f4f4f5',
    text2: '#a1a1aa',
    text3: '#52525b',
    blue: '#60a5fa',
    amber: '#fbbf24',
    violet: '#a78bfa',
    red: '#f87171',
    green: '#34d399',
};

const STATS_CONFIG = [
    { label: 'Saved Jobs', key: 'savedCount', icon: Bookmark, color: T.blue },
    { label: 'Applications', key: 'submitted', icon: FileText, color: T.amber },
    { label: 'Interviews', key: 'interviews', icon: Calendar, color: T.violet },
    { label: 'Offers Received', key: 'offers', icon: ShieldCheck, color: T.green },
];

export default function SeekerHomeClient({ stats, user, recentApplications = [] }) {
    const rawPlan = user?.plan ?? 'seeker_free';
    const planName = rawPlan.includes('_')
        ? rawPlan.split('_')[1].replace(/^\w/, c => c.toUpperCase())
        : rawPlan.replace(/^\w/, c => c.toUpperCase());

    // Prepare chart data
    const chartData = useMemo(() => {
        const dist = stats?.distribution || {};
        return [
            { name: 'Applied', value: dist.applied || 0, color: T.blue },
            { name: 'Under Review', value: dist.under_review || 0, color: T.amber },
            { name: 'Shortlisted', value: dist.shortlisted || 0, color: T.violet },
            { name: 'Rejected', value: dist.rejected || 0, color: T.red },
            { name: 'Offered', value: dist.offered || 0, color: T.green },
        ].filter(d => d.value > 0);
    }, [stats]);

    const totalApplications = stats?.submitted || 0;

    const initials = useMemo(() => {
        if (!user?.name) return '??';
        return user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }, [user]);

    const skillsList = useMemo(() => {
        if (!user?.skills) return [];
        return user.skills.split(',').map(s => s.trim()).filter(Boolean);
    }, [user]);

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 28 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Seeker</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Dashboard</h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Welcome back, {user?.name || 'Job Seeker'}. Here is your application overview.</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
                {STATS_CONFIG.map(({ label, key, icon: Icon, color }) => (
                    <div
                        key={label}
                        style={{
                            borderRadius: 14, border: `1px solid ${T.border}`,
                            background: T.bg1, padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>{label}</p>
                            <span style={{ color, opacity: 0.8 }}><Icon width={16} height={16} /></span>
                        </div>
                        <p style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 600, color: T.text1, lineHeight: 1 }}>
                            {stats?.[key] ?? 0}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 28 }} className="md:grid-cols-2">
                
                {/* Left Profile Card */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyItems: 'center', background: 'linear-gradient(to bottom right, #5C53FE, #7A73FF)' }}>
                            {user?.image ? (
                                <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ margin: 'auto', fontWeight: 'bold', fontSize: 18, color: '#fff' }}>{initials}</span>
                            )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.text1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</h3>
                            <p style={{ margin: '3px 0 0', fontSize: 12, color: T.text3, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                            <span style={{ display: 'inline-flex', marginTop: 8, borderRadius: 9999, background: 'rgba(92,83,254,0.12)', border: '1px solid rgba(92,83,254,0.25)', padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#8E87FF' }}>
                                Seeker {planName}
                            </span>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: T.border }} />

                    <div>
                        <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Headline</p>
                        <p style={{ margin: 0, fontSize: 13, color: T.text2, lineHeight: 1.5 }}>
                            {user?.headline || 'Add a professional headline in settings.'}
                        </p>
                    </div>

                    <div>
                        <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Bio</p>
                        <p style={{ margin: 0, fontSize: 13, color: T.text2, lineHeight: 1.5 }}>
                            {user?.bio || 'Add a professional bio in settings.'}
                        </p>
                    </div>

                    <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Skills</p>
                        {skillsList.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {skillsList.map(skill => (
                                    <span
                                        key={skill}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', borderRadius: 6,
                                            padding: '3px 8px', fontSize: 11, fontWeight: 500,
                                            background: 'rgba(255,255,255,0.04)', color: T.text2,
                                            border: `1px solid ${T.border}`
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>No skills added yet.</p>
                        )}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 10 }}>
                        <Link
                            href="/dashboard/job-seeker/settings"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                borderRadius: 10, border: `1px solid ${T.border}`,
                                background: 'rgba(255,255,255,0.02)', padding: '8px 14px',
                                fontSize: 12, fontWeight: 600, color: T.text2,
                                textDecoration: 'none', transition: 'background 0.15s, border-color 0.15s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = T.border; }}
                        >
                            <Gear width={14} height={14} />
                            Edit Profile Settings
                        </Link>
                    </div>
                </div>

                {/* Right Recharts Card */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text1 }}>Application Flow</h3>
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>Visual status distribution</p>
                        </div>
                    </div>

                    <div style={{ flex: 1, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {totalApplications > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend formatter={(value) => <span style={{ color: T.text2, fontSize: 12 }}>{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: T.text3, marginBottom: 12 }}>
                                    📊
                                </div>
                                <p style={{ margin: 0, fontSize: 13, color: T.text2, fontWeight: 500 }}>No applications submitted yet</p>
                                <p style={{ margin: '4px 0 0', fontSize: 11, color: T.text3, maxWidth: 200 }}>Your application analytics chart will appear here once you apply to jobs.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Recent Activity List */}
            <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text1 }}>Recent Application Updates</h3>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>Logs of latest activity</p>
                    </div>
                    {recentApplications.length > 0 && (
                        <Link href="/dashboard/job-seeker/applications" style={{ fontSize: 12, color: T.blue, textDecoration: 'none' }}>
                            View all
                        </Link>
                    )}
                </div>

                {recentApplications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {recentApplications.map((app) => {
                            const dateStr = app.createAt ? new Date(app.createAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently';
                            const statusDisplay = (app.status || 'applied').replace(/_/g, ' ').toUpperCase();
                            return (
                                <div
                                    key={app._id}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.01)',
                                        border: `1px solid ${T.border}`, gap: 12
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: app.status === 'offered' ? T.green : app.status === 'rejected' ? T.red : T.amber }} />
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.text1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {app.jobTitle}
                                            </p>
                                            <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>{app.companyName}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: T.text2 }}>
                                            {statusDisplay}
                                        </span>
                                        <span style={{ fontSize: 11, color: T.text3 }}>{dateStr}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                        <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>No recent activity to show.</p>
                    </div>
                )}
            </div>

            {/* Responsive grid styles wrapper */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .md-grid-cols-2 {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

        </div>
    );
}
