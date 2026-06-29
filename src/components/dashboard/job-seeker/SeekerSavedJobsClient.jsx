'use client';

import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { deleteBookmark } from '@/lib/actions/bookmark';
import { submitApplication } from '@/lib/actions/applications';
import { TrashBin, ArrowRight, Bookmark, Suitcase, MapPin, CircleDollar } from '@gravity-ui/icons';

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
    green: '#34d399',
    amber: '#fbbf24',
    red: '#f87171',
    blue: '#60a5fa',
};

export default function SeekerSavedJobsClient({ savedJobs: initialJobs = [], initialApplications = [], user, plan }) {
    const [savedJobs, setSavedJobs] = useState(initialJobs);
    const [applications, setApplications] = useState(initialApplications);

    // Apply modal state
    const [activeJob, setActiveJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasApplied = (jobId) => applications.some(a => a.jobId === jobId);

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

    const handleRemoveBookmark = async (jobId) => {
        try {
            await deleteBookmark(user.id, jobId);
            setSavedJobs(prev => prev.filter(j => j._id !== jobId));
            toast.success('Removed from bookmarks');
        } catch (error) {
            console.error('Delete bookmark error:', error);
            toast.error('Failed to remove bookmark');
        }
    };

    const handleApplyClick = (job) => {
        const limit = plan?.maxApplicationPerMonth || 3;
        const currentCount = applications.length;

        if (currentCount >= limit) {
            toast.error(`Application limit reached for your ${plan.name} plan (${currentCount}/${limit}). Upgrade to apply for more roles!`);
            return;
        }

        setActiveJob(job);
        setCoverLetter('');
    };

    const handleConfirmApply = async (e) => {
        e.preventDefault();
        if (!activeJob) return;

        setIsSubmitting(true);
        const payload = {
            jobId: activeJob._id,
            jobTitle: activeJob.job_title,
            companyId: activeJob.companyId,
            companyName: activeJob.companyName,
            companyLogo: activeJob.companyLogo,
            applicantId: user.id,
            applicantName: user.name,
            email: user.email,
            coverLetter,
            resume: user.resume || '',
            status: 'applied',
        };

        try {
            const result = await submitApplication(payload);
            if (result) {
                setApplications(prev => [...prev, payload]);
                toast.success(`Successfully applied for ${activeJob.job_title}!`);
                setActiveJob(null);
            } else {
                toast.error('Failed to submit application');
            }
        } catch (error) {
            console.error('Apply error:', error);
            toast.error('Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 24 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Seeker</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Saved Jobs</h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>View and manage your bookmarked positions.</p>
            </div>

            {/* Saved Jobs List */}
            {savedJobs.length === 0 ? (
                <div style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: '72px 24px', textAlign: 'center', background: T.bg1 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: T.text3 }}>
                        <Bookmark width={22} height={22} />
                    </div>
                    <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: T.text1 }}>No saved jobs yet</h3>
                    <p style={{ margin: '0 0 20px', fontSize: 12, color: T.text3 }}>Explore the jobs directory and bookmark roles you are interested in.</p>
                    <a
                        href="/dashboard/job-seeker/jobs"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 10,
                            background: T.text1, border: 'none', padding: '9px 18px', fontSize: 12, fontWeight: 600,
                            color: '#000', cursor: 'pointer', textDecoration: 'none'
                        }}
                    >
                        Browse open roles
                    </a>
                </div>
            ) : (
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                                    {['Role', 'Company', 'Location', 'Salary', 'Actions'].map((h, i) => (
                                        <th key={h} style={{ padding: '9px 20px', textAlign: i === 4 ? 'right' : 'left', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {savedJobs.map((job) => {
                                    const applied = hasApplied(job._id);
                                    return (
                                        <tr
                                            key={job._id}
                                            style={{ borderBottom: `1px solid ${T.border}`, transition: 'background 0.1s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.012)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '13px 20px' }}>
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.text1 }}>{job.job_title}</p>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, borderRadius: 4, background: 'rgba(255,255,255,0.03)', padding: '2px 6px', fontSize: 10, color: T.text2 }}>
                                                    <Suitcase width={10} height={10} /> {job.job_type?.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '13px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                                    {job.companyLogo ? (
                                                        <img src={job.companyLogo} alt="" style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: 22, height: 22, borderRadius: 6, background: T.bg2, border: `1px solid ${T.border}` }} />
                                                    )}
                                                    <span style={{ fontSize: 12, color: T.text2 }}>{job.companyName}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '13px 20px' }}>
                                                <span style={{ fontSize: 12, color: T.text2, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <MapPin width={11} height={11} /> {job.location || 'Remote'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '13px 20px' }}>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: T.green, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <CircleDollar width={11} height={11} /> {formatSalary(job.min_salary, job.max_salary, job.currency)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 20px' }}>
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <button
                                                        onClick={() => handleRemoveBookmark(job._id)}
                                                        style={{
                                                            padding: 6, borderRadius: 8, border: 'none', background: 'transparent',
                                                            color: T.text3, cursor: 'pointer', display: 'flex', transition: 'color 0.15s, background 0.15s'
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.color = T.red; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.color = T.text3; e.currentTarget.style.background = 'transparent'; }}
                                                        title="Remove from saved"
                                                    >
                                                        <TrashBin width={14} height={14} />
                                                    </button>

                                                    {applied ? (
                                                        <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(52,211,153,0.1)', fontSize: 11, fontWeight: 600, color: T.green }}>
                                                            Applied
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleApplyClick(job)}
                                                            style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 8,
                                                                border: 'none', background: T.text1, color: '#000', fontSize: 11, fontWeight: 600,
                                                                cursor: 'pointer', transition: 'opacity 0.15s'
                                                            }}
                                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                                        >
                                                            Apply <ArrowRight width={10} height={10} />
                                                        </button>
                                                    )}
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

            {/* Apply Confirmation Modal */}
            {activeJob && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
                    }}
                    onClick={() => setActiveJob(null)}
                >
                    <div
                        style={{
                            width: '100%', maxWidth: 540, borderRadius: 16, background: T.bg1, border: `1px solid ${T.border}`,
                            boxShadow: '0 24px 48px rgba(0,0,0,0.6)', overflow: 'hidden'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 20px', borderBottom: `1px solid ${T.border}` }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Apply for {activeJob.job_title}</h3>
                                <p style={{ margin: '2px 0 0', fontSize: 12, color: T.text3 }}>{activeJob.companyName}</p>
                            </div>
                            <button
                                onClick={() => setActiveJob(null)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: T.text3, padding: 0 }}
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <form onSubmit={handleConfirmApply} style={{ padding: 20 }}>
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8 }}>Cover Letter</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Write a brief pitch or cover letter explaining why you are a good fit for this role..."
                                    value={coverLetter}
                                    onChange={e => setCoverLetter(e.target.value)}
                                    style={{
                                        width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${T.border}`, color: T.text1, outline: 'none', fontSize: 13, resize: 'none', lineHeight: 1.5
                                    }}
                                />
                            </div>

                            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, marginBottom: 20, fontSize: 12 }}>
                                <span style={{ color: T.text3, fontWeight: 600 }}>Attached Resume: </span>
                                {user.resume ? (
                                    <span style={{ color: T.green, fontWeight: 500 }}>✓ Loaded from your profile</span>
                                ) : (
                                    <span style={{ color: T.red, fontWeight: 500 }}>✗ No resume in profile (please add in Settings)</span>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                <button
                                    type="button"
                                    onClick={() => setActiveJob(null)}
                                    style={{
                                        padding: '8px 16px', borderRadius: 8, border: `1px solid ${T.border}`,
                                        background: 'transparent', color: T.text2, fontSize: 12, fontWeight: 600, cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        padding: '8px 18px', borderRadius: 8, border: 'none', background: T.text1, color: '#000',
                                        fontSize: 12, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1
                                    }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
