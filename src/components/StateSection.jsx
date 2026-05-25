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

const stats = [
    {
        id: 1,
        icon: <Magnifier width={22} height={22} />,
        value: '50K',
        label: 'Active Jobs',
    },
    {
        id: 2,
        icon: <ChartBar width={22} height={22} className='-rotate-90'  />,
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

const trending = [
    'Product Designer',
    'AI Engineering',
    'Dev-ops Engineer',
];

export default function StatsSection() {
    return (
        <section className="relative overflow-hidden bg-black  py-14 md:py-20 lg:py-28">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B1F] via-black to-black" />

            {/* Stars */}
            <div className="absolute inset-0 opacity-70">
                <div className="absolute top-10 left-8 h-px w-px rounded-full bg-white sm:left-20 sm:h-1 sm:w-1" />
                <div className="absolute top-24 left-1/3 h-px w-px rounded-full bg-white sm:h-1 sm:w-1" />
                <div className="absolute top-16 right-8 h-px w-px rounded-full bg-white sm:right-32 sm:h-1 sm:w-1" />
                <div className="hidden sm:absolute sm:top-44 sm:right-1/4 sm:block sm:h-1 sm:w-1 sm:rounded-full sm:bg-white" />
                <div className="absolute top-56 left-1/4 h-px w-px rounded-full bg-white sm:h-1 sm:w-1" />
                <div className="hidden sm:absolute sm:top-72 sm:right-20 sm:block sm:h-1 sm:w-1 sm:rounded-full sm:bg-white" />
                <div className="absolute top-80 left-4 h-px w-px rounded-full bg-white sm:left-16 sm:h-1 sm:w-1" />
                <div className="hidden sm:absolute sm:top-96 sm:left-1/2 sm:block sm:h-1 sm:w-1 sm:rounded-full sm:bg-white" />
            </div>

            {/* Globe */}
            <div className="absolute left-1/2 -translate-x-1/2 opacity-80 -top-16 w-[260%] xs:w-[220%] sm:-top-8 sm:w-[160%] md:-top-8 md:w-[110%] lg:w-full max-w-none">
                <div className="absolute inset-0 max-md:bg-gradient-to-t max-md:from-black max-md:from-0% max-md:to-transparent max-md:to-[55%]" />
                <Image
                    src="/images/globe.png"
                    alt="Globe"
                    width={1400}
                    height={700}
                    className="w-full object-contain"
                    style={{ height: "auto" }}
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

                {/* Top Badge */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl sm:gap-3 sm:px-5 sm:py-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B4DFF] sm:h-7 sm:w-7">
                            <Briefcase width={14} height={14} className="text-white sm:w-4 sm:h-4" />
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 sm:text-sm sm:tracking-[0.25em]">
                            <span className="mr-1.5 font-semibold text-white sm:mr-2">
                                50,000+
                            </span>
                            New Jobs This Month
                        </p>
                    </div>
                </div>

                {/* Hero */}
                <div className="mx-auto max-w-5xl pt-10 text-center sm:pt-16 md:pt-24">
                    <h1 className="text-3xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        Find Your Dream Job Today
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:mt-6 sm:text-base sm:leading-8 md:max-w-3xl md:text-xl">
                        HireLoop connects top talent with world-class companies.
                        Browse thousands of curated opportunities and land your
                        next role — faster.
                    </p>
                </div>

                {/* Search Box */}
                <div className="mx-auto mt-8 flex max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl sm:mt-10 sm:rounded-[28px] md:flex-row">

                    {/* Job Input */}
                    <div className="flex flex-1 items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
                        <Magnifier width={20} height={20} className="shrink-0 text-white/70 sm:w-6 sm:h-6" />
                        <input
                            type="text"
                            placeholder="Job title, skill or company"
                            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none sm:text-base"
                        />
                    </div>

                    {/* Divider */}
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
                        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B4DFF] transition-all duration-300 hover:scale-[1.02] hover:bg-[#6D5FFF] sm:h-14 md:h-14 md:w-14 md:rounded-2xl">
                            <Magnifier width={20} height={20} className="text-white sm:w-6 sm:h-6" />
                            <span className="text-sm font-medium text-white md:hidden">
                                Search Jobs
                            </span>
                        </button>
                    </div>
                </div>

                {/* Trending */}
                <div className="mt-6 mb-16 flex flex-wrap items-center justify-center gap-2 text-center sm:mt-8 sm:gap-3 sm:mb-32 md:mb-44 lg:mb-52">
                    <p className="w-full text-xs text-white/50 sm:w-auto sm:text-sm">
                        Trending Position
                    </p>
                    {trending.map((item, index) => (
                        <button
                            key={index}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] sm:px-5 sm:py-2 sm:text-sm"
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Stats Heading */}
                <div className="pt-10 text-center sm:pt-16 md:pt-24">
                    <h2 className="mx-auto max-w-4xl text-xl font-light leading-snug text-white sm:text-3xl md:text-4xl lg:text-5xl">
                        Assisting over{' '}
                        <span className="font-medium text-white">15,000</span>{' '}
                        job seekers
                        <br className="hidden sm:block" />
                        find their dream positions.
                    </h2>
                </div>

                {/* Stat Cards */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:mt-16 xl:grid-cols-4">
                    {stats.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#6B5CFF]/40 sm:rounded-[24px] sm:p-6 md:rounded-[28px] md:p-7 md:hover:-translate-y-2"
                        >
                            {/* Card Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-70" />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mb-8 text-white/90 sm:mb-10 md:mb-14">
                                    {item.icon}
                                </div>

                                {/* Number */}
                                <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                                    {item.value}
                                </h3>

                                {/* Label */}
                                <p className="mt-2 text-sm text-white/75 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                                    {item.label}
                                </p>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute -bottom-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#6B5CFF]/20 blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}