'use client';

import { motion } from 'motion/react';
import { Magnifier, Bookmark } from '@gravity-ui/icons';

const ChartLineIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 16L8 10L12 13.5L17 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 19H19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const BuildingIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="4" width="10" height="15" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 8h3.8A1.2 1.2 0 0 1 18 9.2V19H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 8v.01M7 11v.01M7 14v.01M10 8v.01M10 11v.01M10 14v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const CursorClickIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M7 3v3M3 7h3M4.5 4.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 9.5L18 14l-4.5 1.5L12 19.5 8.5 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);

const ResumeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="4" y="2" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7h6M8 11h6M8 15h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const SkillIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 3v2M11 17v2M3 11h2M17 11h2M5.6 5.6l1.4 1.4M15 15l1.4 1.4M15 5.6l-1.4 1.4M6.6 15 5.2 16.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const ArrowTrendUpIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 15L8.5 9L12.5 13L19 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 6H19V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ease = [0.22, 1, 0.36, 1];

const features = [
    {
        id: 1,
        icon: <Magnifier width={22} height={22} />,
        title: 'Smart Search',
        description: 'Find your ideal job with advanced filters.',
    },
    {
        id: 2,
        icon: <ChartLineIcon />,
        title: 'Salary Insights',
        description: 'Get real salary data to negotiate confidently.',
    },
    {
        id: 3,
        icon: <BuildingIcon />,
        title: 'Top Companies',
        description: 'Apply to vetted companies that are hiring.',
    },
    {
        id: 4,
        icon: <Bookmark width={22} height={22} />,
        title: 'Saved Jobs',
        description: 'Manage apps & favorites on your dashboard.',
    },
    {
        id: 5,
        icon: <CursorClickIcon />,
        title: 'One-Click Apply',
        description: 'Simplify your job applications for an easier process!',
    },
    {
        id: 6,
        icon: <ResumeIcon />,
        title: 'Resume Builder',
        description: 'Create professional resumes with modern templates.',
    },
    {
        id: 7,
        icon: <SkillIcon />,
        title: 'Skill-Based Matching',
        description: 'Discover jobs that match your skills and experience.',
    },
    {
        id: 8,
        icon: <ArrowTrendUpIcon />,
        title: 'Career Growth Resources',
        description: 'Boost your career with quick interview tips.',
    },
];

function FeatureCard({ feature }) {
    return (
        <motion.div
            className="group flex items-start gap-4"
            variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
            }}
        >
            {/* Icon Box */}
            <motion.div
                className="relative shrink-0 flex items-center justify-center w-[68px] h-[68px] rounded-2xl border border-white/[0.07] bg-[#1E1E20] text-white/70 overflow-hidden"
                whileHover={{
                    borderColor: 'rgba(107,92,255,0.4)',
                    transition: { duration: 0.25 },
                }}
            >
                {/* Icon inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />

                {/* Hover bloom */}
                <motion.div
                    className="absolute inset-0 bg-[#5B4DFF]/20 blur-xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Animated purple dot */}
                <motion.div
                    className="absolute top-2 right-2 h-1 w-1 rounded-full bg-[#5B4DFF]"
                    animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [1, 1.4, 1],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: feature.id * 0.3,
                        ease: 'easeInOut',
                    }}
                />

                <span className="relative z-10 text-white/60 group-hover:text-white transition-colors duration-200">
                    {feature.icon}
                </span>
            </motion.div>

            {/* Text */}
            <div className="pt-1">
                <h3 className="text-[15px] font-semibold text-white leading-snug">
                    {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/40 max-w-[220px]">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
}

export default function FeaturesSection() {
    return (
        <section
            className="relative overflow-hidden py-20 md:py-28"
            style={{ backgroundColor: '#151516' }}
        >
            {/* Subtle top separator */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#5B4DFF]/[0.05] blur-[100px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

                {/* Header */}
                <motion.div
                    className="text-center mb-16 md:mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12 } },
                    }}
                >
                    {/* Eyebrow */}
                    <motion.div
                        className="inline-flex items-center gap-2.5 mb-5"
                        variants={{
                            hidden: { opacity: 0, y: 14 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                        }}
                    >
                        <div className="h-1 w-1 rounded-full bg-[#5B4DFF]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
                            Features Job
                        </span>
                        <div className="h-1 w-1 rounded-full bg-[#5B4DFF]" />
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
                        }}
                    >
                        Everything you need
                        <br />
                        to succeed
                    </motion.h2>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.09, delayChildren: 0.05 },
                        },
                    }}
                >
                    {features.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </motion.div>

            </div>

            {/* Subtle bottom separator */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </section>
    );
}