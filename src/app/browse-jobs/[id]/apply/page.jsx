import { getUserSession } from '@/lib/core/session';
import { ArrowLeft, Lock, Person, ShieldCheck } from '@gravity-ui/icons';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { FaUpload } from 'react-icons/fa';

const ApplyPage = async({params}) => {
    const { id } = await params;


    const user = await getUserSession()

    if(!user){
        redirect(`/auth/signin?callbackUrl=/browse-jobs/${id}/apply`)
    }

    if (user.role !== 'job_seeker') {
    return (
        <section className="relative min-h-screen overflow-hidden bg-[#090909] flex items-center justify-center">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#1B1440_0%,#090909_55%,#000_100%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:72px_72px]" />

            {/* Glows */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[480px] h-[320px] bg-[#6D5FFF]/[0.12] blur-[120px] rounded-full" />
            <div className="absolute -bottom-16 -right-10 w-[280px] h-[280px] bg-[#5B4DFF]/[0.08] blur-[100px] rounded-full" />

            {/* Orbs */}
            <div className="absolute top-16 left-[12%] w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_18px_5px_rgba(255,255,255,0.3)]" />
            <div className="absolute top-24 right-[15%] w-1.5 h-1.5 rounded-full bg-[#6D5FFF] shadow-[0_0_22px_7px_rgba(109,95,255,0.5)]" />

            {/* Card */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full px-6 py-16">

                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 backdrop-blur-2xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5B4DFF]">
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-white/55 font-medium">
                        Access Restricted
                    </span>
                </div>

                {/* Lock Icon */}
                <div className="relative my-7 w-24 h-24">
                    <div className="absolute inset-0 rounded-full border border-[#6D5FFF]/35" />
                    <div className="absolute inset-2 rounded-full border border-[#6D5FFF]/15" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#5B4DFF]/12">
                        <Lock className="w-9 h-9 text-white/85" strokeWidth={1.6} />
                    </div>
                </div>

                <h1 className="text-3xl font-semibold text-white tracking-tight leading-snug mb-3">
                    This page is for job seekers only
                </h1>
                <p className="text-[15px] text-white/50 leading-7 max-w-sm mb-7">
                    Your account role doesn't have access to job applications.
                    Only{' '}
                    <span className="inline-flex items-center gap-1 bg-[#5B4DFF]/18 border border-[#5B4DFF]/30 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[#b4aaff]">
                        Job Seeker
                    </span>
                    {' '}accounts can apply for positions.
                </p>

                {/* Info Box */}
                <div className="w-full border border-white/[0.08] bg-white/[0.03] rounded-2xl px-5 py-1 backdrop-blur-xl mb-7">
                    {[
                        ['Your role', `${user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}`],
                        ['Required role', 'Job Seeker'],
                        ['To apply', 'Create a separate job seeker account'],
                    ].map(([label, value], i) => (
                        <div key={i} className={`flex items-center gap-3 py-3.5 ${i > 0 ? 'border-t border-white/[0.06]' : ''}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5B4DFF] shrink-0" />
                            <span className="text-[13px] text-white/50 text-left">
                                {label}: <strong className="text-white/85 font-medium">{value}</strong>
                            </span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full">
                    <Link
                        href="/auth/signup?role=job_seeker"
                        className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[#5B4DFF] text-sm font-medium text-white transition-all duration-300 hover:bg-[#6D5FFF] hover:scale-[1.02]"
                    >
                        < Person className="w-4 h-4" />
                        Create a Job Seeker Account
                    </Link>
                    <Link
                        href="/browse-jobs"
                        className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] text-sm font-medium text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Browse Jobs
                    </Link>
                </div>
            </div>
        </section>
    );
}

    console.log('User:', user);
    return (
        <div>
            <h2>Apply for this job</h2>
        </div>
    );
};

export default ApplyPage;