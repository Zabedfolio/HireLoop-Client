'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    House,
    Lock,
    ShieldExclamation,
    ShieldKeyhole,
    Key,
} from '@gravity-ui/icons';

const reasons = [
    {
        id: 1,
        icon: <ShieldKeyhole width={22} height={22} />,
        title: 'Insufficient Role',
        text: 'Your account role doesn\u2019t have access to this section.',
    },
    {
        id: 2,
        icon: <Key width={22} height={22} />,
        title: 'Wrong Account',
        text: 'You may be signed in with an account that lacks permission.',
    },
    {
        id: 3,
        icon: <Lock width={22} height={22} />,
        title: 'Restricted Area',
        text: 'This page is locked to specific permission levels only.',
    },
];

export default function UnauthorizedPage({ requiredRole, currentRole }) {
    const router = useRouter();

    return (
        <section className="relative min-h-screen overflow-hidden bg-black">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1B1440_0%,#090909_45%,#000_100%)]" />

            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.06]">
                <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:80px_80px]" />
            </div>

            {/* Glow Effects */}
            <div className="absolute left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#f87171]/15 blur-[140px]" />
            <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-[#5B4DFF]/10 blur-[120px]" />

            {/* Floating Orbs */}
            <div className="absolute left-[12%] top-32 h-2 w-2 rounded-full bg-white/70 shadow-[0_0_25px_6px_rgba(255,255,255,0.4)]" />
            <div className="absolute right-[18%] top-48 h-2 w-2 rounded-full bg-[#6D5FFF] shadow-[0_0_30px_8px_rgba(109,95,255,0.5)]" />
            <div className="absolute bottom-40 left-[22%] h-2 w-2 rounded-full bg-white/50 shadow-[0_0_20px_5px_rgba(255,255,255,0.3)]" />

            {/* Main Content */}
            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:px-8">

                {/* Badge */}
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-2xl">
                    <motion.div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f87171]"
                        animate={{
                            boxShadow: [
                                '0 0 0px #f87171',
                                '0 0 18px #f8717188',
                                '0 0 0px #f87171',
                            ],
                        }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ShieldExclamation width={16} height={16} className="text-white" />
                    </motion.div>

                    <p className="text-xs uppercase tracking-[0.25em] text-white/60 sm:text-sm">
                        Access Restricted
                    </p>
                </div>

                {/* 403 */}
                <div className="relative mt-10">
                    <h1 className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-[7rem] font-semibold leading-none tracking-tight text-transparent sm:text-[9rem] md:text-[12rem] lg:text-[15rem]">
                        403
                    </h1>

                    {/* Glow Ring */}
                    <div className="absolute left-1/2 top-1/2 -z-10 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f87171]/25" />
                </div>

                {/* Heading */}
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-semibold text-white sm:text-5xl md:text-6xl">
                        You don&rsquo;t have permission to be here.
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base sm:leading-8 md:text-xl">
                        This page is restricted to certain account roles. If you believe
                        this is a mistake, try signing in with a different account or
                        reach out to your administrator.
                    </p>
                </div>

                {/* Role Info Card (only renders if you pass role props) */}
                {(requiredRole || currentRole) && (
                    <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
                        {currentRole && (
                            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:gap-1">
                                <span className="text-[10px] uppercase tracking-[0.12em] text-white/40">Your Role</span>
                                <span className="text-sm font-medium text-white/80">{currentRole}</span>
                            </div>
                        )}
                        {requiredRole && (
                            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1">
                                <span className="text-[10px] uppercase tracking-[0.12em] text-white/40">Required Role</span>
                                <span className="text-sm font-medium text-[#f87171]">{requiredRole}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Lock note row */}
                <div className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                    <Lock width={13} height={13} />
                    <span>This area requires elevated permissions</span>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                    <Link
                        href="/"
                        className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#5B4DFF] px-8 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#6D5FFF]"
                    >
                        <House width={18} height={18} />
                        Go Home
                    </Link>

                    <button
                        onClick={() => router.back()}
                        className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-8 text-sm font-medium text-white/90 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                    >
                        <ArrowLeft width={18} height={18} />
                        Go Back
                    </button>
                </div>

                {/* Reason Cards */}
                <div className="mt-20 grid w-full max-w-6xl gap-4 md:grid-cols-3">
                    {reasons.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#f87171]/40"
                        >
                            {/* Glow */}
                            <div className="absolute -bottom-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#f87171]/20 blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100" />

                            <div className="relative z-10">
                                <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white">
                                    {item.icon}
                                </div>

                                <h3 className="text-2xl font-semibold text-white">
                                    {item.title}
                                </h3>

                                <p className="mt-4 text-base leading-7 text-white/65">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Support link */}
                <p className="mt-12 text-sm text-white/40">
                    Think this is a mistake?{' '}
                    <Link
                        href="/support"
                        className="font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
                    >
                        Contact support
                    </Link>
                </p>
            </div>
        </section>
    );
}