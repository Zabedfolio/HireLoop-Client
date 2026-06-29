'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, Bookmark, CircleCheck, CircleInfo } from '@gravity-ui/icons';

const T = {
    bg0: '#080809',
    bg1: '#0D0D0E',
    bg2: '#111113',
    border: 'rgba(255,255,255,0.07)',
    text1: '#f4f4f5',
    text2: '#a1a1aa',
    text3: '#52525b',
    green: '#34d399',
    amber: '#fbbf24',
    red: '#f87171',
    blue: '#60a5fa',
    violet: '#a78bfa',
};

const PLAN_DETAILS = {
    seeker_free: { name: 'Free Plan', price: '$0/mo', desc: 'Browse & save up to 10 jobs, apply to up to 3 jobs per month.', color: T.text3 },
    seeker_pro: { name: 'Pro Plan', price: '$19/mo', desc: 'Apply to up to 30 jobs per month, unlimited saved jobs, and salary insights.', color: T.blue },
    seeker_premium: { name: 'Premium Plan', price: '$39/mo', desc: 'Unlimited applications, profile boost, early access to new jobs, and priority support.', color: T.green },
};

export default function SeekerBillingClient({ plan, usageCount, subscriptions = [], user }) {
    const rawPlan = user?.plan || 'seeker_free';
    const planDetail = PLAN_DETAILS[rawPlan] || { name: 'Free Plan', price: '$0/mo', desc: 'Browse and apply for jobs.', color: T.text3 };
    const limit = plan?.maxApplicationPerMonth || 3;

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 28 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Seeker</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Subscription & Billing</h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Manage your subscription tiers and review payment invoices.</p>
            </div>

            {/* Current Plan Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 28 }} className="md:grid-cols-[1.5fr_1fr]">
                
                {/* Plan Card */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>Current Subscription</span>
                            <h2 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 600, color: T.text1 }}>{planDetail.name}</h2>
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 750, color: T.text1 }}>{planDetail.price}</span>
                    </div>

                    <p style={{ margin: 0, fontSize: 13, color: T.text2, lineHeight: 1.5 }}>
                        {planDetail.desc}
                    </p>

                    <div style={{ height: '1px', background: T.border, margin: '6px 0' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.text3 }}>
                        <CircleCheck width={14} height={14} style={{ color: T.green }} />
                        <span>Status: <strong style={{ color: T.green }}>Active</strong></span>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <Link
                            href="/pricing"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 10,
                                background: T.text1, border: 'none', padding: '9px 18px', fontSize: 12, fontWeight: 600,
                                color: '#000', cursor: 'pointer', textDecoration: 'none', transition: 'opacity 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            Change Plan
                            <CreditCard width={13} height={13} />
                        </Link>
                    </div>
                </div>

                {/* Application Usage meter */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>Monthly Usage Limit</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12 }}>
                            <span style={{ fontSize: 36, fontWeight: 700, color: T.text1, lineHeight: 1 }}>{usageCount}</span>
                            <span style={{ fontSize: 16, color: T.text3 }}>/ {limit} applications</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ margin: '20px 0' }}>
                        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
                            <div
                                style={{
                                    width: `${Math.min(100, (usageCount / limit) * 100)}%`, height: '100%',
                                    background: usageCount >= limit ? T.red : T.blue, borderRadius: 99
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.text3, marginTop: 8 }}>
                            <span>{Math.round((usageCount / limit) * 100)}% Used</span>
                            <span>{limit - usageCount} remaining</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, fontSize: 11, color: T.text3, lineHeight: 1.4 }}>
                        <span style={{ flexShrink: 0, marginTop: 2 }}><CircleInfo width={11} height={11} /></span>
                        <span>Resets monthly based on your checkout date.</span>
                    </div>
                </div>

            </div>

            {/* Payment History Table */}
            <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: '20px 24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: T.text1 }}>Payment Invoices</h3>
                
                {subscriptions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                        <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>No invoice records found.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                                    {['Date', 'Invoice/Plan', 'Amount', 'Transaction ID', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: T.text3 }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...subscriptions]
                                    .sort((a, b) => new Date(b.createdAt || b.createAt) - new Date(a.createdAt || a.createAt))
                                    .map((subs) => {
                                        const dateStr = subs.createdAt || subs.createAt ? new Date(subs.createdAt || subs.createAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                                        const amountDisplay = subs.amount ? `$${subs.amount.toFixed(2)}` : '$0.00';
                                        const cleanPlan = subs.planId?.split('_')[1]?.toUpperCase() || 'FREE';
                                        
                                        return (
                                            <tr key={subs._id} style={{ borderBottom: `1px solid ${T.border}` }}>
                                                <td style={{ padding: '12px', fontSize: 12, color: T.text2 }}>{dateStr}</td>
                                                <td style={{ padding: '12px', fontSize: 12, color: T.text1, fontWeight: 500 }}>Seeker {cleanPlan}</td>
                                                <td style={{ padding: '12px', fontSize: 12, color: T.text1 }}>{amountDisplay}</td>
                                                <td style={{ padding: '12px', fontSize: 11, color: T.text3, fontFamily: 'monospace' }}>{subs.transactionId || '—'}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ borderRadius: 6, background: 'rgba(52,211,153,0.08)', padding: '2px 6px', fontSize: 10, fontWeight: 600, color: T.green }}>
                                                        Paid
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Responsive grid styles wrapper */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .md-grid-cols-\\[1\\.5fr_1fr\\] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

        </div>
    );
}
