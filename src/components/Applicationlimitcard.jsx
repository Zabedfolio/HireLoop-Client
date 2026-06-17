'use client';

import { BsRocket, BsCheckCircle } from 'react-icons/bs';

/**
 * Status card showing monthly application usage.
 *
 * Renders inline as part of the apply page's hero section (same gradient
 * background, same glass-card treatment as the job summary card below it)
 * instead of as a separate full-width banner — that's what was causing the
 * hard seam between a flat dark strip and the gradient hero underneath it.
 */
export default function ApplicationLimitCard({ applications, plan }) {
    const used = applications.length;
    const remaining = Math.max(plan.maxApplicationPerMonth - used, 0);
    const isFull = remaining <= 0;
    const isLast = !isFull && remaining === 1;
    const pct = Math.min((used / plan.maxApplicationPerMonth) * 100, 100);

    const tone = isFull
        ? {
              ring: 'border-red-500/25',
              wash: 'bg-red-500/[0.06]',
              icon: 'bg-red-500/15 border-red-500/25 text-red-400',
              bar: 'bg-red-400/80',
              count: 'text-red-300',
          }
        : isLast
        ? {
              ring: 'border-amber-500/20',
              wash: 'bg-amber-500/[0.05]',
              icon: 'bg-amber-500/15 border-amber-500/25 text-amber-400',
              bar: 'bg-amber-400/80',
              count: 'text-amber-300',
          }
        : {
              ring: 'border-white/[0.08]',
              wash: 'bg-white/[0.025]',
              icon: 'bg-[#5B4DFF]/15 border-[#5B4DFF]/25 text-[#a59fff]',
              bar: 'bg-gradient-to-r from-[#6D5FFF] to-[#a59fff]',
              count: 'text-white/70',
          };

    return (
        <div className={`mb-8 rounded-2xl border ${tone.ring} ${tone.wash} backdrop-blur-2xl px-5 sm:px-6 py-5`}>
            <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tone.icon}`}>
                    {isFull ? <BsCheckCircle className="w-4 h-4" /> : <BsRocket className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                        <p className="text-[13px] font-medium text-white/85">
                            Applications this month
                        </p>
                        <span className={`text-sm font-semibold tabular-nums ${tone.count}`}>
                            {used}<span className="text-white/30 font-normal">/{plan.maxApplicationPerMonth}</span>
                        </span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                            className={`h-full rounded-full ${tone.bar} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>

                    <p className="text-xs text-white/40 mt-2 leading-relaxed">
                        {isFull
                            ? "You've reached this month's limit — it resets next month."
                            : `${remaining} ${remaining === 1 ? 'application' : 'applications'} remaining this month.`}
                    </p>
                </div>
            </div>
        </div>
    );
}