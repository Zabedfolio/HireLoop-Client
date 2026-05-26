'use client';

import Image from 'next/image';
import {
    Magnifier,
    ChartBar,
    PersonMagnifier,
    Star,
    Briefcase,
    MapPin,
} from '@gravity-ui/icons';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const stats = [
    {
        id: 1,
        icon: <Magnifier width={22} height={22} />,
        value: '50K',
        label: 'Active Jobs',
    },
    {
        id: 2,
        icon: <ChartBar width={22} height={22} className='-rotate-90' />,
        value: '12K',
        label: 'Companies',
    },
    {
        id: 3,
        icon: <PersonMagnifier width={22} height={22} />,
        value: '2M',
        label: 'Job Seekers',
    },
    {
        id: 4,
        icon: <Star width={22} height={22} />,
        value: '97%',
        label: 'Satisfaction Rate',
    },
];

const trending = ['Product Designer', 'AI Engineering', 'Dev-ops Engineer'];

// Shared variants
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
    }),
};

export default function StatsSection() {
    // useRef on a plain div wrapper for useScroll — avoids the motion.section ref conflict
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const globeY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const globeOpacity = useTransform(scrollYProgress, [0, 0.6], [0.8, 0.3]);

    return (
        <section className="relative overflow-hidden bg-black py-14 md:py-20 lg:py-28">
            {/* Scroll target wrapper — plain div, no motion, no conflict */}
            <div ref={sectionRef} className="absolute inset-0 pointer-events-none" />

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B1F] via-black to-black" />

            {/* Stars — staggered fade in */}
            {[
                'top-10 left-8 sm:left-20',
                'top-24 left-1/3',
                'top-16 right-8 sm:right-32',
                'top-56 left-1/4',
                'top-80 left-4 sm:left-16',
            ].map((pos, i) => (
                <motion.div
                    key={i}
                    className={`absolute h-px w-px rounded-full bg-white sm:h-1 sm:w-1 opacity-70 ${pos}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                />
            ))}
            {['top-44 right-1/4', 'top-72 right-20', 'top-96 left-1/2'].map((pos, i) => (
                <motion.div
                    key={`lg-${i}`}
                    className={`hidden sm:absolute sm:block sm:h-1 sm:w-1 sm:rounded-full sm:bg-white ${pos}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                />
            ))}

            {/* Globe — parallax via style, entrance via animate */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-16 w-[260%] xs:w-[220%] sm:-top-8 sm:w-[160%] md:-top-8 md:w-[110%] lg:w-full max-w-none"
                style={{ y: globeY, opacity: globeOpacity }}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="absolute inset-0 max-md:bg-gradient-to-t max-md:from-black max-md:from-0% max-md:to-transparent max-md:to-[55%]" />
                <Image
                    src="/images/globe.png"
                    alt="Globe"
                    width={1400}
                    height={700}
                    className="w-full object-contain"
                    style={{ height: 'auto' }}
                    priority
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

                {/* Top Badge */}
                <motion.div
                    className="flex justify-center"
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    variants={fadeUp}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl sm:gap-3 sm:px-5 sm:py-3">
                        <motion.div
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B4DFF] sm:h-7 sm:w-7"
                            animate={{
                                boxShadow: [
                                    '0 0 0px #5B4DFF',
                                    '0 0 18px #5B4DFF88',
                                    '0 0 0px #5B4DFF',
                                ],
                            }}
                            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Briefcase width={14} height={14} className="text-white sm:w-4 sm:h-4" />
                        </motion.div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 sm:text-sm sm:tracking-[0.25em]">
                            <span className="mr-1.5 font-semibold text-white sm:mr-2">50,000+</span>
                            New Jobs This Month
                        </p>
                    </div>
                </motion.div>

                {/* Hero heading */}
                <div className="mx-auto max-w-5xl pt-10 text-center sm:pt-16 md:pt-24">
                    <motion.h1
                        className="text-3xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
                        initial="hidden"
                        animate="visible"
                        custom={0.15}
                        variants={fadeUp}
                    >
                        Find Your Dream Job Today
                    </motion.h1>
                    <motion.p
                        className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:mt-6 sm:text-base sm:leading-8 md:max-w-3xl md:text-xl"
                        initial="hidden"
                        animate="visible"
                        custom={0.28}
                        variants={fadeUp}
                    >
                        HireLoop connects top talent with world-class companies. Browse thousands
                        of curated opportunities and land your next role — faster.
                    </motion.p>
                </div>

                {/* Search Box */}
                <motion.div
                    className="mx-auto mt-8 flex max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl sm:mt-10 sm:rounded-[28px] md:flex-row"
                    initial={{ opacity: 0, y: 32, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{
                        borderColor: 'rgba(107,92,255,0.35)',
                        transition: { duration: 0.3 },
                    }}
                >
                    {/* Job Input */}
                    <div className="flex flex-1 items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
                        <Magnifier width={20} height={20} className="shrink-0 text-white/70 sm:w-6 sm:h-6" />
                        <input
                            type="text"
                            placeholder="Job title, skill or company"
                            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none sm:text-base"
                        />
                    </div>

                    <div className="h-px w-full bg-white/10 md:h-auto md:w-px" />

                    {/* Location */}
                    <div className="flex flex-1 items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
                        <MapPin width={20} height={20} className="shrink-0 text-white/70 sm:w-[22px] sm:h-[22px]" />
                        <input
                            type="text"
                            placeholder="Location or Remote"
                            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none sm:text-base"
                        />
                    </div>

                    {/* Search Button */}
                    <div className="p-3">
                        <motion.button
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B4DFF] md:h-14 md:w-14 md:rounded-2xl"
                            whileHover={{ scale: 1.04, backgroundColor: '#6D5FFF' }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            <Magnifier width={20} height={20} className="text-white sm:w-6 sm:h-6" />
                            <span className="text-sm font-medium text-white md:hidden">Search Jobs</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Trending */}
                <motion.div
                    className="mt-6 mb-16 flex flex-wrap items-center justify-center gap-2 text-center sm:mt-8 sm:gap-3 sm:mb-32 md:mb-44 lg:mb-52"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.55 } },
                    }}
                >
                    <motion.p
                        className="w-full text-xs text-white/50 sm:w-auto sm:text-sm"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { duration: 0.5 } },
                        }}
                    >
                        Trending Position
                    </motion.p>
                    {trending.map((item, index) => (
                        <motion.button
                            key={index}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/80 backdrop-blur-xl sm:px-5 sm:py-2 sm:text-sm"
                            variants={{
                                hidden: { opacity: 0, y: 12 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                                },
                            }}
                            whileHover={{
                                borderColor: 'rgba(255,255,255,0.25)',
                                backgroundColor: 'rgba(255,255,255,0.07)',
                                y: -2,
                                transition: { duration: 0.2 },
                            }}
                            whileTap={{ scale: 0.96 }}
                        >
                            {item}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Stats Heading — whileInView, no ref needed */}
                <motion.div
                    className="pt-10 text-center sm:pt-16 md:pt-24"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h2 className="mx-auto max-w-4xl text-xl font-light leading-snug text-white sm:text-3xl md:text-4xl lg:text-5xl">
                        Assisting over{' '}
                        <motion.span
                            className="font-medium text-white"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            15,000
                        </motion.span>{' '}
                        job seekers
                        <br className="hidden sm:block" />
                        find their dream positions.
                    </h2>
                </motion.div>

                {/* Stat Cards — whileInView on parent for stagger, no ref */}
                <motion.div
                    className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:mt-16 xl:grid-cols-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
                    }}
                >
                    {stats.map((item) => (
                        <motion.div
                            key={item.id}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] p-5 backdrop-blur-xl sm:rounded-[24px] sm:p-6 md:rounded-[28px] md:p-7"
                            variants={{
                                hidden: { opacity: 0, y: 40, scale: 0.95 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                                },
                            }}
                            whileHover={{
                                y: -8,
                                borderColor: 'rgba(107,92,255,0.4)',
                                transition: { duration: 0.3, ease: 'easeOut' },
                            }}
                        >
                            {/* Card inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-70" />

                            <div className="relative z-10">
                                {/* Icon */}
                                <motion.div
                                    className="mb-8 text-white/90 sm:mb-10 md:mb-14"
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.6 },
                                        visible: {
                                            opacity: 1,
                                            scale: 1,
                                            transition: {
                                                delay: 0.1 + item.id * 0.08,
                                                duration: 0.45,
                                                ease: 'backOut',
                                            },
                                        },
                                    }}
                                >
                                    {item.icon}
                                </motion.div>

                                {/* Number */}
                                <motion.h3
                                    className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
                                    variants={{
                                        hidden: { opacity: 0, x: -10 },
                                        visible: {
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                                delay: 0.15 + item.id * 0.08,
                                                duration: 0.5,
                                                ease: [0.22, 1, 0.36, 1],
                                            },
                                        },
                                    }}
                                >
                                    {item.value}
                                </motion.h3>

                                {/* Label */}
                                <motion.p
                                    className="mt-2 text-sm text-white/75 sm:mt-3 sm:text-base md:mt-4 md:text-lg"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                delay: 0.22 + item.id * 0.08,
                                                duration: 0.5,
                                            },
                                        },
                                    }}
                                >
                                    {item.label}
                                </motion.p>
                            </div>

                            {/* Hover glow */}
                            <motion.div
                                className="absolute -bottom-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#6B5CFF]/20 blur-3xl"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            />
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}