'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Bookmark, FileText, Person, Thunderbolt, CircleCheck, House, ArrowRight, Gear } from '@gravity-ui/icons';

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
    { label: 'Total Job Posts', key: 'totalJobs', icon: FileText, color: T.blue },
    { label: 'Total Applicants', key: 'totalApplicants', icon: Person, color: T.amber },
    { label: 'Active Jobs', key: 'activeJobs', icon: Thunderbolt, color: T.green },
    { label: 'Jobs Closed', key: 'closedJobs', icon: CircleCheck, color: T.red },
];

export default function RecruiterHomeClient({ stats, user }) {
    const company = stats?.company;
    const hasCompany = !!company && !!company.company_name;

    const initials = useMemo(() => {
        if (!user?.name) return '??';
        return user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }, [user]);

    const compInitials = useMemo(() => {
        if (!company?.company_name) return 'CO';
        return company.company_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }, [company]);

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Welcome banner */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 28 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Recruiter</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    Welcome back, {user?.name || 'Recruiter'}
                </h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Manage your job posts, company profile, and applicant status pipelines.</p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
                {STATS_CONFIG.map(({ label, key, icon: Icon, color }) => (
                    <div
                        key={label}
                        style={{
                            borderRadius: 14, border: `1px solid ${T.border}`,
                            background: T.bg1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>{label}</p>
                            <span style={{ color, opacity: 0.8 }}><Icon width={16} height={16} /></span>
                        </div>
                        <p style={{ margin: 0, fontSize: 28, fontWeight: 600, color: T.text1, lineHeight: 1 }}>
                            {stats?.[key] ?? 0}
                        </p>
                    </div>
                ))}
            </div>

            {/* Middle Section (Company card + Recharts Bar Chart) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 28 }} className="md:grid-cols-[1.2fr_1.8fr]">
                
                {/* Left: Company Card */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>My Company Profile</span>
                        {hasCompany && (
                            <span style={{
                                borderRadius: 6, fontSize: 10, fontWeight: 600, padding: '2px 8px', textTransform: 'uppercase',
                                background: company.status === 'approved' ? 'rgba(52,211,153,0.08)' : company.status === 'rejected' ? 'rgba(248,113,113,0.08)' : 'rgba(251,191,36,0.08)',
                                color: company.status === 'approved' ? T.green : company.status === 'rejected' ? T.red : T.amber,
                                border: `1px solid ${company.status === 'approved' ? 'rgba(52,211,153,0.18)' : company.status === 'rejected' ? 'rgba(248,113,113,0.18)' : 'rgba(251,191,36,0.18)'}`
                            }}>
                                {company.status || 'Pending'}
                            </span>
                        )}
                    </div>

                    {hasCompany ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 50, height: 50, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.company_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: 18, fontWeight: 'bold', color: '#555' }}>{compInitials}</span>
                                    )}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company.company_name}</h3>
                                    <p style={{ margin: '2px 0 0', fontSize: 12, color: T.text3, textTransform: 'capitalize' }}>{company.industry} • {company.location}</p>
                                </div>
                            </div>
                            
                            <div style={{ height: '1px', background: T.border }} />

                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Overview</p>
                                <p style={{ margin: 0, fontSize: 12.5, color: T.text2, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {company.description || 'No description provided.'}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', color: T.text3 }}>Employees</p>
                                    <span style={{ fontSize: 12, color: T.text2 }}>{company.employee_count || '—'}</span>
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', color: T.text3 }}>Website</p>
                                    {company.website_url ? (
                                        <a href={`https://${company.website_url}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.blue, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{company.website_url}</a>
                                    ) : (
                                        <span style={{ fontSize: 12, color: T.text3 }}>—</span>
                                    )}
                                </div>
                            </div>

                            <div style={{ paddingTop: 10 }}>
                                <Link
                                    href="/dashboard/recruiter/company"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 8,
                                        border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)',
                                        padding: '7px 12px', fontSize: 11.5, fontWeight: 600, color: T.text2,
                                        textDecoration: 'none', transition: 'background 0.15s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                >
                                    <Gear width={13} height={13} />
                                    Manage Company Details
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', padding: '30px 10px', textAlign: 'center', margin: 'auto' }}>
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏢</div>
                            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>No Company Registered</h3>
                            <p style={{ margin: 0, fontSize: 11.5, color: T.text3, maxWidth: 200 }}>Register your company profile to create job postings and hire seekers.</p>
                            <Link
                                href="/dashboard/recruiter/company"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 8,
                                    background: T.text1, padding: '7px 14px', fontSize: 11.5, fontWeight: 600,
                                    color: '#000', textDecoration: 'none'
                                }}
                            >
                                Register Company
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right: Analytics Chart */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text1 }}>Applicant Volume</h3>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>Number of applicants per job post listing</p>
                    </div>

                    <div style={{ flex: 1, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {stats?.chartData && stats.chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={stats.chartData} barSize={16}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="name" stroke={T.text3} fontSize={10} tickLine={false} />
                                    <YAxis stroke={T.text3} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="applicants" fill={T.blue} radius={[4, 4, 0, 0]}>
                                        {stats.chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? T.blue : T.violet} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: T.text3, marginBottom: 12 }}>
                                    📊
                                </div>
                                <p style={{ margin: 0, fontSize: 13, color: T.text2, fontWeight: 500 }}>No active analytics data</p>
                                <p style={{ margin: '4px 0 0', fontSize: 11, color: T.text3, maxWidth: 220 }}>Post job listings to track applicant traffic metrics.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Recent Applicants Feed */}
            <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text1 }}>Recent Applicants</h3>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>Latest candidates applied across your open roles</p>
                    </div>
                </div>

                {stats?.recentApplicants && stats.recentApplicants.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {stats.recentApplicants.map((app) => {
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyItems: 'center', border: `1px solid ${T.border}` }}>
                                            <span style={{ margin: 'auto', fontSize: 11, fontWeight: 'bold', color: T.text2 }}>
                                                {app.applicantName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                            </span>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {app.applicantName}
                                            </p>
                                            <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>Role: <span style={{ color: T.text2 }}>{app.jobTitle}</span></p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                                        <span style={{
                                            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                                            background: app.status === 'offered' ? 'rgba(52,211,153,0.1)' : app.status === 'rejected' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                                            color: app.status === 'offered' ? T.green : app.status === 'rejected' ? T.red : T.amber
                                        }}>
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
                        <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>No candidates have applied to your roles yet.</p>
                    </div>
                )}
            </div>

            {/* Responsive grid styles wrapper */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .md-grid-cols-\\[1\\.2fr_1\\.8fr\\] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

        </div>
    );
}
