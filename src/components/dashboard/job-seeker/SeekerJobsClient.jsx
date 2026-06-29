'use client';

import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { addBookmark, deleteBookmark } from '@/lib/actions/bookmark';
import { submitApplication } from '@/lib/actions/applications';
import { Bookmark, BookmarkFill, Magnifier, Suitcase, MapPin, CircleDollar, ArrowRight } from '@gravity-ui/icons';

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
    borderHover: 'rgba(255,255,255,0.13)',
    text1: '#f4f4f5',
    text2: '#a1a1aa',
    text3: '#52525b',
    green: '#34d399',
    amber: '#fbbf24',
    red: '#f87171',
    blue: '#60a5fa',
    violet: '#a78bfa',
};

const JOB_TYPES = [
    { label: 'Full-time', value: 'full_time' },
    { label: 'Part-time', value: 'part_time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Internship', value: 'internship' },
];

export default function SeekerJobsClient({ jobs = [], initialBookmarks = [], initialApplications = [], user, plan }) {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [locationFilter, setLocationFilter] = useState('');
    const [bookmarks, setBookmarks] = useState(initialBookmarks.map(b => b._id || b.id));
    const [applications, setApplications] = useState(initialApplications);

    // Apply modal state
    const [activeJob, setActiveJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Categories list from jobs
    const categories = useMemo(() => {
        const cats = new Set(jobs.map(j => j.job_category).filter(Boolean));
        return ['all', ...Array.from(cats)];
    }, [jobs]);

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

    const isSaved = (jobId) => bookmarks.includes(jobId);
    const hasApplied = (jobId) => applications.some(a => a.jobId === jobId);

    const handleBookmarkToggle = async (job) => {
        const jobId = job._id || job.id;
        const saved = isSaved(jobId);

        try {
            if (saved) {
                await deleteBookmark(user.id, jobId);
                setBookmarks(prev => prev.filter(id => id !== jobId));
                toast.success('Removed from bookmarks');
            } else {
                await addBookmark(user.id, jobId);
                setBookmarks(prev => [...prev, jobId]);
                toast.success('Added to bookmarks');
            }
        } catch (error) {
            console.error('Bookmark error:', error);
            toast.error('Failed to update bookmark');
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

    // Filter jobs
    const filteredJobs = useMemo(() => {
        return jobs.filter(j => {
            const matchesSearch =
                (j.job_title?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
                (j.companyName?.toLowerCase() ?? '').includes(search.toLowerCase());
            const matchesType = selectedType === 'all' || j.job_type === selectedType;
            const matchesCategory = selectedCategory === 'all' || j.job_category === selectedCategory;
            const matchesLocation =
                !locationFilter ||
                (j.location?.toLowerCase() ?? '').includes(locationFilter.toLowerCase());
            
            // Only show active jobs
            const isActive = j.status === 'active';
            
            return matchesSearch && matchesType && matchesCategory && matchesLocation && isActive;
        });
    }, [jobs, search, selectedType, selectedCategory, locationFilter]);

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Seeker</p>
                    <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Explore Jobs</h1>
                    <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Search and apply to open roles directly within your workspace.</p>
                </div>
                
                {/* Plan limit meter */}
                <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 14px', fontSize: 12 }}>
                    <span style={{ color: T.text3, fontWeight: 600 }}>Plan Usage: </span>
                    <span style={{ color: T.text1, fontWeight: 600 }}>{applications.length}</span>
                    <span style={{ color: T.text3 }}> / {plan?.maxApplicationPerMonth || 3} applications</span>
                </div>
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                {/* Search field */}
                <div style={{ position: 'relative', flex: '1 1 240px' }}>
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

                {/* Location field */}
                <div style={{ position: 'relative', flex: '1 1 180px' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.text3 }}><MapPin width={14} height={14} /></span>
                    <input
                        type="text"
                        placeholder="Location/Remote..."
                        value={locationFilter}
                        onChange={e => setLocationFilter(e.target.value)}
                        style={{
                            width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 34px', borderRadius: 10,
                            background: T.bg1, border: `1px solid ${T.border}`, color: T.text1, outline: 'none', fontSize: 13
                        }}
                    />
                </div>

                {/* Type select */}
                <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    style={{
                        padding: '10px 14px', borderRadius: 10, background: T.bg1, border: `1px solid ${T.border}`,
                        color: T.text2, outline: 'none', fontSize: 13, cursor: 'pointer'
                    }}
                >
                    <option value="all">All Types</option>
                    {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>

                {/* Category select */}
                <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    style={{
                        padding: '10px 14px', borderRadius: 10, background: T.bg1, border: `1px solid ${T.border}`,
                        color: T.text2, outline: 'none', fontSize: 13, cursor: 'pointer', textTransform: 'capitalize'
                    }}
                >
                    {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                </select>
            </div>

            {/* Jobs Listing */}
            {filteredJobs.length === 0 ? (
                <div style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: '60px 20px', textAlign: 'center', background: T.bg1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.text2 }}>No jobs match your search parameters</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: T.text3 }}>Try modifying your filters or search keywords.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                    {filteredJobs.map(job => {
                        const saved = isSaved(job._id);
                        const applied = hasApplied(job._id);

                        return (
                            <div
                                key={job._id}
                                style={{
                                    border: `1px solid ${T.border}`, borderRadius: 16, background: T.bg1, padding: 18,
                                    display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color 0.15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
                                onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                    <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {job.companyLogo ? (
                                                <img src={job.companyLogo} alt={job.companyName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <span style={{ fontSize: 16, fontWeight: 'bold', color: '#555' }}>{job.companyName?.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text1 }}>{job.job_title}</h3>
                                            <p style={{ margin: '2px 0 0', fontSize: 12, color: T.text3 }}>{job.companyName}</p>
                                        </div>
                                    </div>

                                    {/* Bookmark button */}
                                    <button
                                        onClick={() => handleBookmarkToggle(job)}
                                        style={{
                                            border: 'none', background: 'transparent', cursor: 'pointer',
                                            padding: 4, display: 'flex', color: saved ? T.amber : T.text3,
                                            transition: 'color 0.15s'
                                        }}
                                        title={saved ? 'Remove bookmark' : 'Bookmark job'}
                                    >
                                        {saved ? <BookmarkFill width={16} height={16} /> : <Bookmark width={16} height={16} />}
                                    </button>
                                </div>

                                {/* Meta details */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: T.text2 }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Suitcase width={13} height={13} /> {job.job_type?.replace(/_/g, ' ')}</span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin width={13} height={13} /> {job.location || 'Remote'}</span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CircleDollar width={13} height={13} /> {formatSalary(job.min_salary, job.max_salary, job.currency)}</span>
                                </div>

                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.03)' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                    <a
                                        href={`/jobs/${job._id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ fontSize: 12, color: T.blue, textDecoration: 'none', fontWeight: 500 }}
                                    >
                                        View details in public page
                                    </a>

                                    {applied ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 8, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', padding: '6px 12px', fontSize: 12, fontWeight: 600, color: T.green }}>
                                            Applied
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleApplyClick(job)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', borderRadius: 8,
                                                background: T.text1, color: '#000', padding: '6px 14px', fontSize: 12, fontWeight: 600,
                                                cursor: 'pointer', transition: 'opacity 0.15s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                        >
                                            Apply
                                            <ArrowRight width={12} height={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
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
                        {/* Header */}
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

                        {/* Form */}
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

                            {/* Resume attachment status */}
                            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, marginBottom: 20, fontSize: 12 }}>
                                <span style={{ color: T.text3, fontWeight: 600 }}>Attached Resume: </span>
                                {user.resume ? (
                                    <span style={{ color: T.green, fontWeight: 500 }}>✓ Loaded from your profile</span>
                                ) : (
                                    <span style={{ color: T.red, fontWeight: 500 }}>✗ No resume in profile (please add in Settings)</span>
                                )}
                            </div>

                            {/* Footer */}
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
