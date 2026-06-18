'use client';

import {
    BsCheck2,
    BsLightningChargeFill,
    BsGraphUpArrow,
    BsBuildingsFill,
    BsRocketTakeoffFill,
    BsArrowRight,
    BsPersonFill,
    BsBriefcaseFill,
} from 'react-icons/bs';

import { useState } from 'react';

/* ─────────────────────────────────────────
   Static data — Job Seeker plans
───────────────────────────────────────── */
const SEEKER_PLANS = [
    {
        id: 'free',
        icon: <BsLightningChargeFill className="w-4 h-4" />,
        name: 'Free',
        monthly: 0,
        tagline: 'Get your search off the ground',
        features: [
            'Browse & save up to 10 jobs',
            'Apply to up to 3 jobs / month',
            'Basic profile',
            'Email alerts',
        ],
        featured: false,
    },
    {
        id: 'pro',
        icon: <BsGraphUpArrow className="w-4 h-4" />,
        name: 'Pro',
        monthly: 19,
        tagline: 'For an active job search',
        features: [
            'Apply to up to 30 jobs / month',
            'Unlimited saved jobs',
            'Application tracking',
            'Salary insights',
        ],
        featured: true,
    },
    {
        id: 'premium',
        icon: <BsRocketTakeoffFill className="w-4 h-4" />,
        name: 'Premium',
        monthly: 39,
        tagline: 'Get noticed, get hired faster',
        features: [
            'Everything in Pro',
            'Unlimited applications',
            'Profile boost to recruiters',
            'Early access to new jobs',
            'Priority support',
        ],
        featured: false,
    },
];

/* ─────────────────────────────────────────
   Static data — Recruiter plans
───────────────────────────────────────── */
const RECRUITER_PLANS = [
    {
        id: 'free',
        icon: <BsLightningChargeFill className="w-4 h-4" />,
        name: 'Free',
        monthly: 0,
        tagline: "Great for a company's first year of hiring",
        features: [
            'Up to 3 active job posts',
            'Basic applicant management',
            'Standard listing visibility',
        ],
        featured: false,
    },
    {
        id: 'growth',
        icon: <BsGraphUpArrow className="w-4 h-4" />,
        name: 'Growth',
        monthly: 49,
        tagline: 'For teams hiring regularly',
        features: [
            'Up to 10 active job posts',
            'Applicant tracking',
            'Basic analytics',
            'Email support',
        ],
        featured: true,
    },
    {
        id: 'enterprise',
        icon: <BsBuildingsFill className="w-4 h-4" />,
        name: 'Enterprise',
        monthly: 149,
        tagline: 'For high-volume hiring teams',
        features: [
            'Up to 50 active job posts',
            'Advanced analytics dashboard',
            'Featured job listings',
            'Team collaboration',
            'Custom branding',
            'Priority support',
        ],
        featured: false,
    },
];

const YEARLY_DISCOUNT = 0.25; // 25% off, matches the "Save 25%" badge

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function PricingSection() {
    const [billing, setBilling] = useState('monthly'); // 'monthly' | 'yearly'
    const [audience, setAudience] = useState('seekers'); // 'seekers' | 'recruiters'

    const plans = audience === 'seekers' ? SEEKER_PLANS : RECRUITER_PLANS;

    return (
        <section className="relative overflow-hidden bg-[#010103]">
            {/* Background */}
            <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:72px_72px]" />
            <div className="absolute top-16 left-[10%] w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_18px_5px_rgba(255,255,255,0.3)]" />
            <div className="absolute top-28 right-[12%] w-1.5 h-1.5 rounded-full bg-[#6D5FFF] shadow-[0_0_22px_7px_rgba(109,95,255,0.5)]" />

            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">

                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-5">
                        <span className="w-1.5 h-1.5 rounded-sm bg-[#5B4DFF]" />
                        <span className="text-xs uppercase tracking-[0.3em] text-white/45 font-medium">
                            Pricing
                        </span>
                        <span className="w-1.5 h-1.5 rounded-sm bg-[#5B4DFF]" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-tight mb-4 max-w-2xl">
                        Plans built for{' '}
                        <span className="text-[#a59fff]">
                            {audience === 'seekers' ? 'your job search' : 'your hiring pipeline'}
                        </span>
                    </h1>
                    <p className="text-white/45 text-[15px] leading-7 max-w-md mb-9">
                        {audience === 'seekers'
                            ? 'Start free, upgrade when you need more reach.'
                            : 'Start free, scale up as your hiring needs grow.'}
                    </p>

                    {/* Audience toggle */}
                    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 mb-4 backdrop-blur-xl">
                        <ToggleButton
                            active={audience === 'seekers'}
                            onClick={() => setAudience('seekers')}
                            icon={<BsPersonFill className="w-3.5 h-3.5" />}
                            label="For Job Seekers"
                        />
                        <ToggleButton
                            active={audience === 'recruiters'}
                            onClick={() => setAudience('recruiters')}
                            icon={<BsBriefcaseFill className="w-3.5 h-3.5" />}
                            label="For Recruiters"
                        />
                    </div>

                    {/* Billing toggle */}
                    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
                        <ToggleButton
                            active={billing === 'monthly'}
                            onClick={() => setBilling('monthly')}
                            label="Monthly"
                        />
                        <ToggleButton
                            active={billing === 'yearly'}
                            onClick={() => setBilling('yearly')}
                            label="Yearly"
                            badge="Save 25%"
                        />
                    </div>
                </div>

                {/* ── Plan cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
                    {plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} billing={billing} />
                    ))}
                </div>

                {/* Footnote */}
                <p className="text-center text-xs text-white/30 mt-10">
                    Prices in USD. Cancel or switch plans anytime from your account settings.
                </p>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────
   Toggle pill button (used for both toggles)
───────────────────────────────────────── */
function ToggleButton({ active, onClick, icon, label, badge }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'relative flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium',
                'transition-all duration-200',
                active
                    ? 'bg-white text-[#0a0a0a]'
                    : 'text-white/50 hover:text-white/80',
            ].join(' ')}
        >
            {icon}
            {label}
            {badge && (
                <span
                    className={[
                        'ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
                        active ? 'bg-[#E5479A] text-white' : 'bg-[#E5479A]/20 text-[#f08bc1]',
                    ].join(' ')}
                >
                    {badge}
                </span>
            )}
        </button>
    );
}

/* ─────────────────────────────────────────
   Pricing card
───────────────────────────────────────── */
function PlanCard({ plan, billing }) {
    const price =
        billing === 'yearly'
            ? Math.round(plan.monthly * (1 - YEARLY_DISCOUNT))
            : plan.monthly;

    return (
        <div
            className={[
                'relative flex flex-col rounded-2xl backdrop-blur-2xl p-6 sm:p-7 transition-all duration-300',
                plan.featured
                    ? 'border border-[#5B4DFF]/40 bg-[#5B4DFF]/[0.08] sm:-translate-y-2 shadow-[0_0_60px_-15px_rgba(91,77,255,0.5)]'
                    : 'border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15]',
            ].join(' ')}
        >
            {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5B4DFF] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Most Popular
                </span>
            )}

            {/* Icon chip */}
            <div
                className={[
                    'flex h-10 w-10 items-center justify-center rounded-xl mb-5',
                    plan.featured
                        ? 'bg-[#5B4DFF] text-white'
                        : 'border border-white/10 bg-white/[0.05] text-[#a59fff]',
                ].join(' ')}
            >
                {plan.icon}
            </div>

            {/* Name + price */}
            <h3 className="text-[15px] font-semibold text-white mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-semibold text-white tracking-tight">
                    ${price}
                </span>
                <span className="text-sm text-white/35">/month</span>
            </div>
            <p className="text-xs text-white/40 mb-6 leading-5">{plan.tagline}</p>

            {/* Divider */}
            <div className="h-px w-full bg-white/[0.06] mb-6" />

            {/* Features */}
            <ul className="flex flex-col gap-3 mb-7 flex-1">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/65">
                        <span
                            className={[
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5',
                                plan.featured
                                    ? 'bg-[#5B4DFF]/30 text-[#c7c1ff]'
                                    : 'bg-white/[0.06] text-white/40',
                            ].join(' ')}
                        >
                            <BsCheck2 className="w-3 h-3" />
                        </span>
                        <span className="leading-5">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <button
                type="button"
                className={[
                    'flex h-12 w-full items-center justify-center gap-2 rounded-[14px] text-sm font-medium',
                    'transition-all duration-300 hover:scale-[1.01]',
                    plan.featured
                        ? 'bg-[#5B4DFF] text-white hover:bg-[#6D5FFF]'
                        : 'bg-white/[0.05] border border-white/10 text-white/80 hover:bg-white/[0.09] hover:border-white/20',
                ].join(' ')}
            >
                {plan.monthly === 0 ? 'Get Started' : 'Choose This Plan'}
                <BsArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}