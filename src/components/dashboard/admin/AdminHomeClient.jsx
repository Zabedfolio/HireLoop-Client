'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Person, FileText, Bookmark, CircleCheck, CircleInfo, ShieldExclamation, Thunderbolt } from '@gravity-ui/icons';

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
    { label: 'Total Platform Users', key: 'totalUsers', icon: Person, color: T.blue },
    { label: 'Job Seekers', key: 'totalSeekers', icon: Person, color: T.violet },
    { label: 'Recruiters', key: 'totalRecruiters', icon: Person, color: T.amber },
    { label: 'Jobs Posted', key: 'totalJobs', icon: FileText, color: T.green },
    { label: 'Registered Companies', key: 'totalCompanies', icon: CircleInfo, color: T.blue },
    { label: 'Pending Approvals', key: 'pendingCompaniesCount', icon: ShieldExclamation, color: T.amber },
];

export default function AdminHomeClient({ stats }) {
    const formattedRevenue = useMemo(() => {
        const rev = Number(stats?.totalRevenue) || 0;
        return `$${rev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, [stats]);

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 28, display: 'flex', flexWrap: 'wrap', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
                <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Admin</p>
                    <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Console Dashboard</h1>
                    <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Real-time overview of user registrations, company status, and jobs statistics.</p>
                </div>
                
                {/* Revenue card */}
                <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>Platform Revenue</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: T.green }}>{formattedRevenue}</span>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
                {STATS_CONFIG.map(({ label, key, icon: Icon, color }) => (
                    <div
                        key={label}
                        style={{
                            borderRadius: 14, border: `1px solid ${T.border}`,
                            background: T.bg1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ margin: 0, fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>{label}</p>
                            <span style={{ color, opacity: 0.8 }}><Icon width={16} height={16} /></span>
                        </div>
                        <p style={{ margin: 0, fontSize: 28, fontWeight: 600, color: T.text1, lineHeight: 1 }}>
                            {stats?.[key] ?? 0}
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="md:grid-cols-2">
                
                {/* User registration Line/Area chart */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text1 }}>User Growth</h3>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>Timeseries data of user account registrations</p>
                    </div>

                    <div style={{ flex: 1, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {stats?.userRegistrations && stats.userRegistrations.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={stats.userRegistrations}>
                                    <defs>
                                        <linearGradient id="userGlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={T.blue} stopOpacity={0.2} />
                                            <stop offset="95%" stopColor={T.blue} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="date" stroke={T.text3} fontSize={10} tickLine={false} />
                                    <YAxis stroke={T.text3} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke={T.blue} strokeWidth={2} fillOpacity={1} fill="url(#userGlow)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ fontSize: 12, color: T.text3 }}>No registration history to display.</p>
                        )}
                    </div>
                </div>

                {/* Job categories Bar chart */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text1 }}>Jobs by Category</h3>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>Number of listing postings grouped by sector</p>
                    </div>

                    <div style={{ flex: 1, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {stats?.jobsByCategory && stats.jobsByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={stats.jobsByCategory} barSize={16}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="category" stroke={T.text3} fontSize={10} tickLine={false} />
                                    <YAxis stroke={T.text3} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="count" fill={T.violet} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ fontSize: 12, color: T.text3 }}>No category statistics available.</p>
                        )}
                    </div>
                </div>

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
