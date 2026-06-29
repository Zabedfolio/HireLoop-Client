'use client';

import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { updateApplicationStatus } from '@/lib/actions/applications';
import { ArrowLeft, FileText, Check, ShieldCheck, Envelope, Calendar, CircleInfo } from '@gravity-ui/icons';

const CloseIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

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

const STATUS_OPTIONS = [
    { label: 'Applied', value: 'applied' },
    { label: 'Under Review', value: 'under_review' },
    { label: 'Shortlisted', value: 'shortlisted' },
    { label: 'Offered', value: 'offered' },
    { label: 'Rejected', value: 'rejected' },
];

export default function RecruiterApplicantsClient({ initialApplicants = [], job }) {
    const [applicants, setApplicants] = useState(initialApplicants);
    const [selectedTab, setSelectedTab] = useState('all');
    const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
            toast.success(`Application status updated to ${newStatus.replace(/_/g, ' ')}`);
        } catch (error) {
            console.error('Update status error:', error);
            toast.error('Failed to update status');
        }
    };

    const filteredApplicants = useMemo(() => {
        if (selectedTab === 'all') return applicants;
        return applicants.filter(a => a.status === selectedTab);
    }, [applicants, selectedTab]);

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Back link */}
            <a
                href="/dashboard/recruiter/jobs"
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: T.text3, textDecoration: 'none', fontSize: 12, fontWeight: 600,
                    marginBottom: 16, transition: 'color 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = T.text2}
                onMouseLeave={e => e.currentTarget.style.color = T.text3}
            >
                <ArrowLeft width={14} height={14} />
                Back to Jobs
            </a>

            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 24 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Applicants for</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {job?.job_title || 'Job Posting'}
                </h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>{job?.location} • {job?.job_type?.replace(/_/g, ' ')}</p>
            </div>

            {/* Tabs & Count summary */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 6, background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 10, padding: 4 }}>
                    {['all', 'applied', 'under_review', 'shortlisted', 'offered', 'rejected'].map(tab => {
                        const count = tab === 'all' ? applicants.length : applicants.filter(a => a.status === tab).length;
                        const label = tab === 'all' ? 'All' : tab.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
                        const active = selectedTab === tab;

                        return (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                style={{
                                    border: 'none', background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                                    borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 550,
                                    color: active ? T.text1 : T.text3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                    transition: 'color 0.1s, background 0.1s'
                                }}
                            >
                                <span>{label}</span>
                                <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: active ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)', color: active ? T.text2 : T.text3 }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List Table */}
            {filteredApplicants.length === 0 ? (
                <div style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: '60px 20px', textAlign: 'center', background: T.bg1 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: T.text3, marginBottom: 12 }}>
                        👥
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text2 }}>No candidates in this stage</p>
                </div>
            ) : (
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                                    {['Candidate', 'Applied', 'Resume', 'Cover Letter', 'Pipeline Stage'].map(h => (
                                        <th key={h} style={{ padding: '9px 20px', textAlign: 'left', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplicants.map((app) => {
                                    const dateStr = app.createAt ? new Date(app.createAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';
                                    const init = app.applicantName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '??';

                                    return (
                                        <tr key={app._id} style={{ borderBottom: `1px solid ${T.border}` }}>
                                            
                                            {/* Candidate */}
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                                                        <span style={{ margin: 'auto', fontSize: 11, fontWeight: 'bold', color: T.text2 }}>{init}</span>
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text1 }}>{app.applicantName}</p>
                                                        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3, display: 'flex', alignItems: 'center', gap: 4 }}><Envelope width={10} height={10} /> {app.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Applied Date */}
                                            <td style={{ padding: '14px 20px', fontSize: 12, color: T.text2 }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar width={11} height={11} /> {dateStr}</span>
                                            </td>

                                            {/* Resume */}
                                            <td style={{ padding: '14px 20px' }}>
                                                {app.resume ? (
                                                    <a
                                                        href={app.resume}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: T.blue, textDecoration: 'none', fontWeight: 500 }}
                                                    >
                                                        <FileText width={12} height={12} /> View Resume
                                                    </a>
                                                ) : (
                                                    <span style={{ fontSize: 12, color: T.text3 }}>Not provided</span>
                                                )}
                                            </td>

                                            {/* Cover Letter */}
                                            <td style={{ padding: '14px 20px' }}>
                                                {app.coverLetter ? (
                                                    <button
                                                        onClick={() => setSelectedCoverLetter(app)}
                                                        style={{
                                                            border: 'none', background: 'transparent', color: T.text2, fontSize: 12,
                                                            cursor: 'pointer', textDecoration: 'underline', padding: 0
                                                        }}
                                                    >
                                                        Read message
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: 12, color: T.text3 }}>—</span>
                                                )}
                                            </td>

                                            {/* Status Dropdown */}
                                            <td style={{ padding: '10px 20px' }}>
                                                <select
                                                    value={app.status || 'applied'}
                                                    onChange={e => handleStatusChange(app._id, e.target.value)}
                                                    style={{
                                                        padding: '6px 10px', borderRadius: 8, background: T.bg2, border: `1px solid ${T.border}`,
                                                        color: app.status === 'offered' ? T.green : app.status === 'rejected' ? T.red : app.status === 'shortlisted' ? T.violet : T.text2,
                                                        outline: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                                                    }}
                                                >
                                                    {STATUS_OPTIONS.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Cover Letter Modal */}
            {selectedCoverLetter && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
                    }}
                    onClick={() => setSelectedCoverLetter(null)}
                >
                    <div
                        style={{
                            width: '100%', maxWidth: 500, borderRadius: 16, background: T.bg1, border: `1px solid ${T.border}`,
                            boxShadow: '0 24px 48px rgba(0,0,0,0.6)', overflow: 'hidden'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 20px', borderBottom: `1px solid ${T.border}` }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Cover Letter pitch</h3>
                                <p style={{ margin: '2px 0 0', fontSize: 12, color: T.text3 }}>From {selectedCoverLetter.applicantName}</p>
                            </div>
                            <button
                                onClick={() => setSelectedCoverLetter(null)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: T.text3, padding: 0 }}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div style={{ padding: 20, fontSize: 13.5, color: T.text2, lineHeight: 1.6, maxHeight: 300, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                            {selectedCoverLetter.coverLetter}
                        </div>
                        <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.01)', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedCoverLetter(null)}
                                style={{
                                    padding: '6px 14px', borderRadius: 8, border: `1px solid ${T.border}`,
                                    background: 'transparent', color: T.text2, fontSize: 11.5, fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
