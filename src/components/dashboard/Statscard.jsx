'use client';

import React from 'react';

/**
 * StatsCard
 *
 * Props:
 *   label  {string}          – card label, e.g. "Total Job Posts"
 *   value  {string|number}   – display value, e.g. "1,284"
 *   icon   {React.ElementType} – any icon component that accepts width/height props
 */
export default function StatsCard({ label, value, icon: Icon }) {
    return (
        <div
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
    );
}