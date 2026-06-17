'use client';

import { BsArrowLeft, BsLightningChargeFill, BsShieldCheck, BsCalendar3 } from 'react-icons/bs';
import Link from 'next/link';

/**
 * Full-page gate shown when a job seeker has hit their free-plan application limit.
 */
export default function ApplicationLimitExceeded({ plan, applications, job }) {
    const resetDate = getNextMonthReset();
    const pct = Math.min((applications.length / plan.maxApplicationPerMonth) * 100, 100);

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#090909] flex items-center justify-center px-4 py-16">

            {/* ── Background ── */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1B1440_0%,#090909_55%,#000_100%)]" />
            <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:72px_72px]" />

            {/* Glows */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[560px] h-[340px] bg-[#6D5FFF]/[0.13] blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#5B4DFF]/[0.07] blur-[110px] rounded-full pointer-events-none" />

            {/* Orbs */}
            <div className="absolute top-14 left-[10%] w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_18px_5px_rgba(255,255,255,0.3)]" />
            <div className="absolute top-24 right-[12%] w-1.5 h-1.5 rounded-full bg-[#6D5FFF] shadow-[0_0_22px_7px_rgba(109,95,255,0.5)]" />
            <div className="absolute bottom-20 left-[18%] w-1 h-1 rounded-full bg-[#a59fff]/60 shadow-[0_0_14px_4px_rgba(165,159,255,0.35)]" />

            {/* ── Content ── */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">

                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#5B4DFF]/30 bg-[#5B4DFF]/[0.10] px-5 py-2.5 backdrop-blur-2xl mb-7">
                    <BsLightningChargeFill className="w-3.5 h-3.5 text-[#a59fff]" />
                    <span className="text-xs uppercase tracking-[0.2em] text-[#a59fff]/80 font-medium">
                        Monthly limit reached
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-[2rem] sm:text-[2.4rem] font-semibold text-white tracking-tight leading-[1.2] mb-4">
                    You've used all{' '}
                    <span className="text-[#a59fff]">{plan.maxApplicationPerMonth} free</span>
                    {' '}applications this month
                </h1>

                <p className="text-[15px] text-white/45 leading-7 max-w-sm mb-8">
                    Your limit resets on{' '}
                    <span className="text-white/65 font-medium">{resetDate}</span>.
                    Upgrade your plan to keep applying now.
                </p>

                {/* Usage bar */}
                <div className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl px-5 py-4 mb-8">
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs text-white/40 uppercase tracking-wider">Applications used</span>
                        <span className="text-xs font-semibold text-red-300 tabular-nums">
                            {applications.length}/{plan.maxApplicationPerMonth}
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-red-400/70 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Primary — pricing page */}
                    <Link
                        href="/pricing"
                        className="group relative flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#5B4DFF] text-sm font-semibold text-white overflow-hidden hover:bg-[#6D5FFF] hover:scale-[1.02] transition-all duration-300"
                    >
                        {/* Shimmer sweep */}
                        <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                        <BsLightningChargeFill className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">View plans &amp; pricing</span>
                    </Link>

                    {/* Secondary — back to job */}
                    <Link
                        href={job?._id ? `/browse-jobs/${job._id}` : '/browse-jobs'}
                        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] text-sm font-medium text-white/70 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.06] hover:text-white/90 transition-all duration-300"
                    >
                        <BsArrowLeft className="w-4 h-4" />
                        Back to job listing
                    </Link>
                </div>

                {/* Reset notice */}
                <div className="flex items-center gap-2.5 mt-7">
                    <BsCalendar3 className="w-3.5 h-3.5 text-white/20 shrink-0" />
                    <p className="text-xs text-white/30">
                        Free applications reset on the 1st of each month
                    </p>
                </div>

            </div>
        </section>
    );
}

/** Returns a formatted string like "Aug 1, 2025" for the 1st of next month */
function getNextMonthReset() {
    const now = new Date();
    const reset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return reset.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}