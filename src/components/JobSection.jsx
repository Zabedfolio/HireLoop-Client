'use client';

import { motion } from 'motion/react';
import { MapPin, ArrowRight } from '@gravity-ui/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllJobs } from '@/lib/api/jobs';

const ease = [0.22, 1, 0.36, 1];

const typeBadgeColors = {
    Hybrid:       'bg-[#5B4DFF]/20 text-[#A99CFF] border-[#5B4DFF]/25',
    Remote:       'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    'On-site':    'bg-amber-500/15 text-amber-400 border-amber-500/25',
    'Full-time':  'bg-sky-500/15 text-sky-400 border-sky-500/25',
    'Contract':   'bg-rose-500/15 text-rose-400 border-rose-500/25',
    'Freelance':  'bg-violet-500/15 text-violet-400 border-violet-500/25',
};

const normaliseType = (raw = '') => {
    const s = raw.toLowerCase().replace(/[-_\s]+/g, '');
    if (s === 'fulltime')  return 'Full-time';
    if (s === 'contract')  return 'Contract';
    if (s === 'freelance') return 'Freelance';
    if (s === 'remote')    return 'Remote';
    if (s === 'hybrid')    return 'Hybrid';
    if (s === 'onsite')    return 'On-site';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const formatSalary = (min, max, currency = 'USD') => {
    const fmt = (n) => {
        const num = parseInt(n, 10);
        if (isNaN(num)) return null;
        return num >= 1000 ? `${Math.round(num / 1000)}k` : `${num}`;
    };
    const symbol = currency === 'BDT' ? '৳' : '$';
    const fMin = fmt(min);
    const fMax = fmt(max);
    if (!fMin && !fMax) return null;
    if (!fMin) return `${symbol}${fMax}`;
    if (!fMax) return `${symbol}${fMin}`;
    return `${symbol}${fMin} – ${symbol}${fMax}`;
};

// ─── Icons ────────────────────────────────────────────────────────────────

const SalaryIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 4v6M5.5 8.5c0 .828.672 1 1.5 1s1.5-.448 1.5-1-.672-1-1.5-1-1.5-.448-1.5-1 .672-1 1.5-1 1.5.172 1.5 1"
              stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
);

const WorkTypeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 4V3C5 2.44772 5.44772 2 6 2H8C8.55228 2 9 2.44772 9 3V4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────

const SkeletonCard = () => (
    <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] p-6 animate-pulse">
        <div className="h-5 w-2/5 rounded-md bg-white/10 mb-3" />
        <div className="h-3 w-4/5 rounded bg-white/[0.06] mb-1.5" />
        <div className="h-3 w-3/5 rounded bg-white/[0.06] mb-5" />
        <div className="flex gap-2">
            <div className="h-7 w-24 rounded-full bg-white/[0.06]" />
            <div className="h-7 w-20 rounded-full bg-white/[0.06]" />
        </div>
        <div className="mt-6 pt-4 border-t border-white/[0.07] h-4 w-20 rounded bg-white/[0.06]" />
    </div>
);

// ─── Job Card ─────────────────────────────────────────────────────────────

function JobCard({ job, index }) {
    const typeLabel  = normaliseType(job.job_type ?? '');
    const badgeClass = typeBadgeColors[typeLabel] ?? 'bg-white/10 text-white/60 border-white/10';
    const salary     = formatSalary(job.min_salary, job.max_salary, job.currency);
    const jobId      = job._id?.$oid ?? job._id ?? 'unknown';

    return (
        <motion.div
            className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] p-6 cursor-pointer"
            variants={{
                hidden:  { opacity: 0, y: 40, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease } },
            }}
            whileHover={{
                y: -6,
                borderColor: 'rgba(107, 92, 255, 0.4)',
                transition: { duration: 0.28, ease: 'easeOut' },
            }}
        >
            {/* Inner subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />

            {/* Hover glow bloom */}
            <motion.div
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-36 w-36 rounded-full bg-[#5B4DFF]/20 blur-3xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            />

            <div className="relative z-10 flex flex-col h-full">
                {/* Title */}
                <h3 className="text-xl font-semibold text-white leading-snug">
                    {job.job_title}
                </h3>

                {/* Company name */}
                {job.companyName && (
                    <p className="mt-1 text-xs font-medium text-white/35">{job.companyName}</p>
                )}

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-white/45 line-clamp-2">
                    {job.job_description ?? job.description ?? job.requirements ?? ''}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {job.location && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/60">
                            <MapPin width={12} height={12} />
                            {job.location}
                        </span>
                    )}

                    {typeLabel && (
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${badgeClass}`}>
                            <WorkTypeIcon />
                            {typeLabel}
                        </span>
                    )}

                    {salary && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/60">
                            <SalaryIcon />
                            {salary}
                        </span>
                    )}
                </div>

                {/* Apply Now + dates */}
                <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3">
                    <Link href={`/browse-jobs/${jobId}`}>
                        <motion.div
                            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200"
                            whileHover={{ x: 3 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                            Apply Now
                            <ArrowRight width={14} height={14} className="text-[#7B6FFF]" />
                        </motion.div>
                    </Link>

                    <div className="flex flex-col items-end gap-0.5 text-[11px] leading-tight text-white/25 shrink-0">
                        {job.createAt?.$date && (
                            <span>
                                Posted {new Date(job.createAt.$date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        )}
                        {job.deadline && (
                            <span className={
                                new Date(job.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000
                                    ? 'text-rose-400/70'
                                    : 'text-white/25'
                            }>
                                Deadline {new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Section ──────────────────────────────────────────────────────────────

export default function JobsSection() {
    const [jobs, setJobs]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const data = await getAllJobs();
                const list = Array.isArray(data) ? data : (data?.jobs ?? []);
                setJobs(list.slice(0, 6)); // cap at 6 for the landing section
            } catch (err) {
                console.error('JobsSection fetch error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <section className="relative overflow-hidden bg-black py-20 md:py-28">

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050508] to-black" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Top ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#5B4DFF]/[0.06] blur-[120px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

                {/* Section Header */}
                <motion.div
                    className="text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden:  {},
                        visible: { transition: { staggerChildren: 0.12, delayChildren: 0 } },
                    }}
                >
                    {/* Eyebrow */}
                    <motion.div
                        className="inline-flex items-center gap-2.5 mb-6"
                        variants={{
                            hidden:  { opacity: 0, y: 16 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                        }}
                    >
                        <div className="h-1 w-1 rounded-full bg-[#5B4DFF]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                            Smart Job Discovery
                        </span>
                        <div className="h-1 w-1 rounded-full bg-[#5B4DFF]" />
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl"
                        variants={{
                            hidden:  { opacity: 0, y: 22 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
                        }}
                    >
                        The roles you'd never
                        <br />
                        <span className="text-white/70 font-light">find by searching</span>
                    </motion.h2>
                </motion.div>

                {/* Cards Grid */}
                {loading ? (
                    <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 md:mt-16">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : error ? (
                    <p className="mt-14 text-center text-white/40 text-sm">
                        Could not load jobs right now.
                    </p>
                ) : (
                    <motion.div
                        className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 md:mt-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={{
                            hidden:  {},
                            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
                        }}
                    >
                        {jobs.map((job, index) => (
                            <JobCard key={job._id?.$oid ?? job._id ?? index} job={job} index={index} />
                        ))}
                    </motion.div>
                )}

                {/* CTA Button */}
                <motion.div
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.65, ease }}
                >
                    <Link href="/browse-jobs">
                        <motion.div
                            className="relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/20 bg-white/[0.05] px-8 py-3.5 text-sm font-medium text-white backdrop-blur-xl cursor-pointer"
                            whileHover={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderColor: 'rgba(107,92,255,0.5)',
                                scale: 1.02,
                                transition: { duration: 0.2 },
                            }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {/* Button glow on hover */}
                            <motion.span
                                className="absolute inset-0 bg-[#5B4DFF]/10 blur-xl"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <span className="relative">View all open jobs</span>
                            <ArrowRight width={15} height={15} className="relative text-[#7B6FFF]" />
                        </motion.div>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}