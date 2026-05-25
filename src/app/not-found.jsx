'use client';

import Link from 'next/link';
import {
    ArrowLeft,
    TriangleExclamation,
    House,
    Magnifier,
    Briefcase,
    Rocket,
    Sparkles,
} from '@gravity-ui/icons';

const suggestions = [
    'Frontend Developer',
    'UI/UX Designer',
    'Remote Jobs',
    'AI Engineer',
];

const cards = [
    {
        id: 1,
        icon: <Briefcase width={22} height={22} />,
        title: '50K+ Jobs',
        text: 'Explore thousands of curated opportunities worldwide.',
    },
    {
        id: 2,
        icon: <Rocket width={22} height={22} />,
        title: 'Fast Hiring',
        text: 'Connect instantly with top companies hiring now.',
    },
    {
        id: 3,
        icon: <Sparkles width={22} height={22} />,
        title: 'Career Growth',
        text: 'Discover roles tailored to your experience and goals.',
    },
];

export default function NotFoundPage() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-black">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1B1440_0%,#090909_45%,#000_100%)]" />

            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.06]">
                <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:80px_80px]" />
            </div>

            {/* Glow Effects */}
            <div className="absolute left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#6D5FFF]/20 blur-[140px]" />
            <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-[#5B4DFF]/10 blur-[120px]" />

            {/* Floating Orbs */}
            <div className="absolute left-[12%] top-32 h-2 w-2 rounded-full bg-white/70 shadow-[0_0_25px_6px_rgba(255,255,255,0.4)]" />
            <div className="absolute right-[18%] top-48 h-2 w-2 rounded-full bg-[#6D5FFF] shadow-[0_0_30px_8px_rgba(109,95,255,0.5)]" />
            <div className="absolute bottom-40 left-[22%] h-2 w-2 rounded-full bg-white/50 shadow-[0_0_20px_5px_rgba(255,255,255,0.3)]" />

            {/* Main Content */}
            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:px-8">

                {/* Badge */}
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-2xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5B4DFF]">
                        <TriangleExclamation
                            width={16}
                            height={16}
                            className="text-white"
                        />
                    </div>

                    <p className="text-xs uppercase tracking-[0.25em] text-white/60 sm:text-sm">
                        Lost in Space
                    </p>
                </div>

                {/* 404 */}
                <div className="relative mt-10">
                    <h1 className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-[7rem] font-semibold leading-none tracking-tight text-transparent sm:text-[9rem] md:text-[12rem] lg:text-[15rem]">
                        404
                    </h1>

                    {/* Glow Ring */}
                    <div className="absolute left-1/2 top-1/2 -z-10 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6D5FFF]/30" />
                </div>

                {/* Heading */}
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-semibold text-white sm:text-5xl md:text-6xl">
                        This page drifted away.
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base sm:leading-8 md:text-xl">
                        The page you’re trying to access doesn’t exist or may
                        have been moved. Try searching for jobs or head back to
                        the homepage.
                    </p>
                </div>

                {/* Search */}
                <div className="mx-auto mt-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl md:flex-row">

                    <div className="flex flex-1 items-center gap-4 px-5 py-5">
                        <Magnifier
                            width={22}
                            height={22}
                            className="text-white/60"
                        />

                        <input
                            type="text"
                            placeholder="Search jobs, companies or skills"
                            className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none sm:text-base"
                        />
                    </div>

                    <div className="h-px w-full bg-white/10 md:h-auto md:w-px" />

                    <div className="p-3">
                        <button className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#5B4DFF] px-7 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#6D5FFF]">
                            Search Jobs
                        </button>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <p className="w-full text-xs text-white/45 sm:w-auto sm:text-sm">
                        Trending Searches
                    </p>

                    {suggestions.map((item, index) => (
                        <button
                            key={index}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-col gap-4 sm:flex-row">

                    <Link
                        href="/"
                        className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#5B4DFF] px-8 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#6D5FFF]"
                    >
                        <House width={18} height={18} />
                        Go Home
                    </Link>

                    <Link
                        href="/jobs"
                        className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-8 text-sm font-medium text-white/90 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                    >
                        <ArrowLeft width={18} height={18} />
                        Browse Jobs
                    </Link>
                </div>

                {/* Cards */}
                <div className="mt-20 grid w-full max-w-6xl gap-4 md:grid-cols-3">
                    {cards.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#6D5FFF]/40"
                        >
                            {/* Glow */}
                            <div className="absolute -bottom-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#6D5FFF]/20 blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100" />

                            <div className="relative z-10">
                                <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white">
                                    {item.icon}
                                </div>

                                <h3 className="text-3xl font-semibold text-white">
                                    {item.title}
                                </h3>

                                <p className="mt-4 text-base leading-7 text-white/65">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}