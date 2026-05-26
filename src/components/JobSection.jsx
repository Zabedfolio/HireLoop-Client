'use client';

import { motion } from 'motion/react';
import { MapPin, ArrowRight } from '@gravity-ui/icons';

const ease = [0.22, 1, 0.36, 1];

const jobs = [
    {
        id: 1,
        title: 'Frontend Developer',
        description: 'Showcase your commitment to diversity and inclusion by highlighting initiatives',
        location: 'New York, USA',
        type: 'Hybrid',
        salary: '€25–€40/hour',
    },
    {
        id: 2,
        title: 'Product Designer',
        description: 'Lead end-to-end design processes and shape product direction with a cross-functional team',
        location: 'San Francisco, USA',
        type: 'Remote',
        salary: '€30–€55/hour',
    },
    {
        id: 3,
        title: 'AI Engineer',
        description: 'Build and deploy cutting-edge ML models that power next-generation user experiences',
        location: 'Berlin, Germany',
        type: 'On-site',
        salary: '€40–€70/hour',
    },
    {
        id: 4,
        title: 'DevOps Engineer',
        description: 'Maintain and scale distributed cloud infrastructure for millions of daily active users',
        location: 'London, UK',
        type: 'Hybrid',
        salary: '€35–€60/hour',
    },
    {
        id: 5,
        title: 'Backend Developer',
        description: 'Design and build high-performance APIs and microservices serving global traffic',
        location: 'Amsterdam, NL',
        type: 'Remote',
        salary: '€28–€50/hour',
    },
    {
        id: 6,
        title: 'Data Scientist',
        description: 'Transform complex datasets into actionable insights that drive strategic decisions',
        location: 'Toronto, Canada',
        type: 'Hybrid',
        salary: '€32–€58/hour',
    },
];

const typeBadgeColors = {
    Hybrid: 'bg-[#5B4DFF]/20 text-[#A99CFF] border-[#5B4DFF]/25',
    Remote: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    'On-site': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
};

const SalaryIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 4v6M5.5 8.5c0 .828.672 1 1.5 1s1.5-.448 1.5-1-.672-1-1.5-1-1.5-.448-1.5-1 .672-1 1.5-1 1.5.172 1.5 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
);

const WorkTypeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 4V3C5 2.44772 5.44772 2 6 2H8C8.55228 2 9 2.44772 9 3V4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
);

function JobCard({ job, index }) {
    return (
        <motion.div
            className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] p-6 cursor-pointer"
            variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.65, ease },
                },
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
                    {job.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-white/45 line-clamp-2">
                    {job.description}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {/* Location */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/60">
                        <MapPin width={12} height={12} />
                        {job.location}
                    </span>

                    {/* Work Type */}
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${typeBadgeColors[job.type]}`}>
                        <WorkTypeIcon />
                        {job.type}
                    </span>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/60">
                            <SalaryIcon />
                            {job.salary}
                        </span>
                </div>

                {/* Apply Now */}
                <div className="mt-6 pt-4 border-t border-white/[0.07]">
                    <motion.div
                        className="inline-flex items-center gap-2 text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200"
                        whileHover={{ x: 3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                        Apply Now
                        <ArrowRight width={14} height={14} className="text-[#7B6FFF]" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default function JobsSection() {
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
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12, delayChildren: 0 } },
                    }}
                >
                    {/* Eyebrow */}
                    <motion.div
                        className="inline-flex items-center gap-2.5 mb-6"
                        variants={{
                            hidden: { opacity: 0, y: 16 },
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
                            hidden: { opacity: 0, y: 22 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
                        }}
                    >
                        The roles you'd never
                        <br />
                        <span className="text-white/70 font-light">find by searching</span>
                    </motion.h2>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                    className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 md:mt-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                        },
                    }}
                >
                    {jobs.map((job, index) => (
                        <JobCard key={job.id} job={job} index={index} />
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.65, ease }}
                >
                    <motion.button
                        className="relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/20 bg-white/[0.05] px-8 py-3.5 text-sm font-medium text-white backdrop-blur-xl"
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
                        <span className="relative">View all job open</span>
                        <ArrowRight width={15} height={15} className="relative text-[#7B6FFF]" />
                    </motion.button>
                </motion.div>

            </div>
        </section>
    );
}