'use client';

import React from 'react';
import { useSession } from '@/lib/auth-client';
import FileText from '@gravity-ui/icons/FileText';
import Persons from '@gravity-ui/icons/Persons';
import Thunderbolt from '@gravity-ui/icons/Thunderbolt';
import CircleCheckFill from '@gravity-ui/icons/CircleCheckFill';
import Plus from '@gravity-ui/icons/Plus';

/* ── Static data ─────────────────────────────────────────── */
const stats = [
    { label: 'Total Job Posts',   value: '48',    icon: FileText },
    { label: 'Total Applicants',  value: '1,284', icon: Persons },
    { label: 'Active Jobs',       value: '18',    icon: Thunderbolt },
    { label: 'Jobs Closed',       value: '32',    icon: CircleCheckFill },
];

const applications = [
    { id: 1, name: 'Julianne Moore',  role: 'Senior Product Designer', date: 'Oct 24, 2023', exp: '6 years', status: 'Interviewing' },
    { id: 2, name: 'Robert Downey',   role: 'Backend Engineer',        date: 'Oct 23, 2023', exp: '4 years', status: 'New' },
    { id: 3, name: 'Emma Stone',      role: 'Marketing Lead',          date: 'Oct 22, 2023', exp: '8 years', status: 'Reviewing' },
    { id: 4, name: 'Chris Pratt',     role: 'Product Manager',         date: 'Oct 21, 2023', exp: '5 years', status: 'Rejected' },
];

const companies = [
    { id: 1, name: 'Google Inc.',      sub: 'Technology • Mountain View', jobs: 24, color: '#4285F4', letter: 'G' },
    { id: 2, name: 'Meta Platforms',   sub: 'Social Media • Menlo Park',  jobs: 18, color: '#0082FB', letter: 'M' },
    { id: 3, name: 'Stripe',           sub: 'Fintech • San Francisco',    jobs: 12, color: '#635BFF', letter: 'S' },
    { id: 4, name: 'Tesla',            sub: 'Automotive • Austin',        jobs: 31, color: '#E82127', letter: 'T' },
];

/* ── Status badge ────────────────────────────────────────── */
const statusStyles = {
    Interviewing: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    New:          'bg-white/10       text-white/70    border-white/15',
    Reviewing:    'bg-amber-500/15   text-amber-400   border-amber-500/25',
    Rejected:     'bg-red-500/15     text-red-400     border-red-500/25',
};

function StatusBadge({ status }) {
    return (
        <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
            ${statusStyles[status] ?? 'bg-white/10 text-white/60 border-white/10'}
        `}>
            {status}
        </span>
    );
}

/* ── Avatar initials ─────────────────────────────────────── */
function Avatar({ name, size = 'md' }) {
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
    const sz = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-sm';
    return (
        <div className={`${sz} rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/70 font-medium shrink-0`}>
            {initials}
        </div>
    );
}

/* ── Main page ───────────────────────────────────────────── */
export default function RecruiterDashboardHomePage() {
    const { data: session, isPending } = useSession();

    const firstName = isPending
        ? ''
        : session?.user?.name?.split(' ')[0] ?? 'there';

    return (
        <div className="min-h-full text-white">

            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    {isPending
                        ? <span className="inline-block h-8 w-64 rounded-lg bg-white/10 animate-pulse" />
                        : <>Welcome back, {session?.user?.name ?? 'there'}</>
                    }
                </h1>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map(({ label, value, icon: Icon }) => (
                    <div
                        key={label}
                        className="
                            rounded-2xl border border-white/10 bg-white/[0.03]
                            p-5 flex flex-col gap-6
                            hover:bg-white/[0.05] transition-colors duration-200
                        "
                    >
                        <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60">
                            <Icon width={18} height={18} />
                        </div>
                        <div>
                            <p className="text-white/50 text-xs mb-1">{label}</p>
                            <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom two-column section */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

                {/* Recent Applications */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-white">Recent Applications</h2>
                        <button className="text-xs text-white/50 hover:text-white transition-colors">View all</button>
                    </div>

                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                        {/* Table header */}
                        <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr] gap-4 px-5 py-3 border-b border-white/10 bg-white/[0.02]">
                            {['Candidate Name', 'Role', 'Date Applied', 'Experience', 'Status'].map(h => (
                                <span key={h} className="text-xs font-medium text-white/40 uppercase tracking-wider">{h}</span>
                            ))}
                        </div>

                        {/* Rows */}
                        {applications.map((app, i) => (
                            <div
                                key={app.id}
                                className={`
                                    grid grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr] gap-4
                                    items-center px-5 py-4
                                    hover:bg-white/[0.03] transition-colors duration-150 cursor-pointer
                                    ${i < applications.length - 1 ? 'border-b border-white/[0.06]' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar name={app.name} />
                                    <span className="text-sm font-semibold text-white truncate">{app.name}</span>
                                </div>
                                <span className="text-sm text-white/60 truncate">{app.role}</span>
                                <span className="text-sm text-white/50">{app.date}</span>
                                <span className="text-sm text-white/50">{app.exp}</span>
                                <StatusBadge status={app.status} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Top Companies */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-white">My Top Companies</h2>
                        <button className="text-xs text-white/50 hover:text-white transition-colors">View all</button>
                    </div>

                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                        <div className="divide-y divide-white/[0.06]">
                            {companies.map(c => (
                                <div
                                    key={c.id}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors duration-150 cursor-pointer"
                                >
                                    {/* Company logo placeholder */}
                                    <div
                                        className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                                        style={{ backgroundColor: `${c.color}22`, border: `1px solid ${c.color}44` }}
                                    >
                                        <span style={{ color: c.color }}>{c.letter}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                                        <p className="text-xs text-white/40 mt-0.5 truncate">{c.sub}</p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-white">{c.jobs}</p>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Active Jobs</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-white/[0.06]">
                            <button className="
                                w-full py-2.5 rounded-xl
                                border border-white/10 bg-white/[0.03]
                                text-sm text-white/60 hover:text-white hover:bg-white/[0.06]
                                transition-all duration-200
                            ">
                                View All Companies
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAB */}
            <button className="
                fixed bottom-6 right-6
                h-13 w-13 rounded-full
                bg-white text-black
                flex items-center justify-center
                shadow-2xl shadow-black/50
                hover:scale-105 active:scale-95
                transition-transform duration-150
                z-30
            ">
                <Plus width={22} height={22} />
            </button>
        </div>
    );
}