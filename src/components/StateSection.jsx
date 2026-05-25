'use client';

import Image from 'next/image';
import {
    Magnifier,
    ChartBar,
    PersonMagnifier,
    Star
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
        icon: <ChartBar width={22} height={22} />,
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

export default function StatsSection() {
    return (
        <section className="relative overflow-hidden bg-black py-20 md:py-28">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B1F] via-black to-black" />

            {/* Stars */}
            <div className="absolute inset-0 opacity-70">
                <div className="absolute top-10 left-20 h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-24 left-1/3 h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-16 right-32 h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-44 right-1/4 h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-56 left-1/4 h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-72 right-20 h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-80 left-16 h-1 w-1 rounded-full bg-white" />
                <div className="absolute top-96 left-1/2 h-1 w-1 rounded-full bg-white" />
            </div>

            {/* Purple Glow */}
            <div className="absolute top-10 md:top-24 left-1/2 h-[260px] w-[260px] md:h-[500px] md:w-[500px] -translate-x-1/2 rounded-full bg-[#5B4DFF]/40 blur-[100px] md:blur-[140px]" />

            {/* Globe */}
            <div className="absolute -top-90 md:-top-160 left-1/2 w-[180%] md:w-full max-w-none -translate-x-1/2 opacity-90">
                <Image
                    src="/images/globe.png"
                    alt="Globe"
                    width={1400}
                    height={700}
                    className="w-full object-contain"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
                {/* Heading */}
                <div className="pt-36 sm:pt-48 md:pt-72 text-center">
                    <h2 className="mx-auto max-w-4xl text-2xl font-light leading-[1.3] text-white sm:text-3xl md:text-5xl">
                        Assisting over{' '}
                        <span className="font-medium text-white">
                            15,000
                        </span>{' '}
                        job seekers
                        <br className="hidden sm:block" />
                        find their dream positions.
                    </h2>
                </div>

                {/* Cards */}
                <div className="mt-12 md:mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-[24px] md:rounded-[28px] border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] p-6 md:p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#6B5CFF]/40"
                        >
                            {/* Card Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-70" />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mb-10 md:mb-14 text-white/90">
                                    {item.icon}
                                </div>

                                {/* Number */}
                                <h3 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
                                    {item.value}
                                </h3>

                                {/* Label */}
                                <p className="mt-3 md:mt-4 text-base md:text-lg text-white/75">
                                    {item.label}
                                </p>
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute -bottom-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#6B5CFF]/20 blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}