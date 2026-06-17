'use client';

import { BsChevronDown } from 'react-icons/bs';
import { useState } from 'react';

/* ─────────────────────────────────────────
   Static data — FAQ items
   Covers: cancellation, refunds, payment
   methods, and plan switching (per spec)
───────────────────────────────────────── */
const FAQ_ITEMS = [
    {
        id: 'cancel',
        question: 'Can I cancel my subscription anytime?',
        answer:
            "Yes. You can cancel from your account settings at any time, with no questions asked. You'll keep access to your current plan's features until the end of the billing period you've already paid for, then your account moves to the Free plan automatically.",
    },
    {
        id: 'refunds',
        question: "What's your refund policy?",
        answer:
            "If something isn't working as expected, reach out to support within 14 days of being charged and we'll issue a full refund. After that window, charges for the current billing period are final, but you're always free to cancel so you aren't charged again going forward.",
    },
    {
        id: 'payment',
        question: 'What payment methods do you accept?',
        answer:
            'We accept all major credit and debit cards (Visa, Mastercard, American Express). Invoicing and bank transfer are available on annual Enterprise plans — contact support to set that up.',
    },
    {
        id: 'switching',
        question: 'Can I switch plans later?',
        answer:
            "Absolutely. You can upgrade or downgrade at any time from your billing settings. Upgrades apply immediately and you're only charged the prorated difference; downgrades take effect at the start of your next billing cycle so you don't lose access mid-period.",
    },
];

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function PricingFAQ() {
    const [openId, setOpenId] = useState(null);

    const toggle = (id) => {
        setOpenId((current) => (current === id ? null : id));
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center text-center mb-9">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">
                    Frequently asked questions
                </h2>
                <p className="text-white/45 text-sm leading-6">
                    Everything about billing, cancellations, and switching plans.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {FAQ_ITEMS.map((item) => (
                    <FaqRow
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onToggle={() => toggle(item.id)}
                    />
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   Single accordion row
───────────────────────────────────────── */
function FaqRow({ item, isOpen, onToggle }) {
    return (
        <div
            className={[
                'rounded-2xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden',
                isOpen
                    ? 'border-[#5B4DFF]/30 bg-[#5B4DFF]/[0.06]'
                    : 'border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15]',
            ].join(' ')}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
            >
                <span className="text-sm font-medium text-white/85">{item.question}</span>
                <span
                    className={[
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                        isOpen
                            ? 'border-[#5B4DFF]/50 bg-[#5B4DFF]/20 text-[#a59fff] rotate-180'
                            : 'border-white/10 bg-white/[0.05] text-white/40',
                    ].join(' ')}
                >
                    <BsChevronDown className="w-3 h-3" />
                </span>
            </button>

            <div
                className={[
                    'grid transition-all duration-300 ease-in-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                ].join(' ')}
            >
                <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-4 sm:pb-5 text-sm text-white/55 leading-7">
                        {item.answer}
                    </p>
                </div>
            </div>
        </div>
    );
}