'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, CircleCheck, CircleInfo } from '@gravity-ui/icons';

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
};

const PLAN_DETAILS = {
    recruiter_free: { name: 'Free Tier', price: '$0/mo', desc: 'Post up to 1 active job listing on HireLoop.', color: T.text3 },
    recruiter_growth: { name: 'Growth Plan', price: '$99/mo', desc: 'Post up to 10 active job listings with advanced candidate pipeline filtering.', color: T.blue },
    recruiter_enterprise: { name: 'Enterprise Plan', price: '$299/mo', desc: 'Unlimited active jobs, priority candidate matchmaking search, and dedicated support.', color: T.green },
};

export default function RecruiterBillingClient({ plan, usageCount, subscriptions = [], user }) {
    const rawPlan = user?.plan || 'recruiter_free';
    const planDetail = PLAN_DETAILS[rawPlan] || { name: 'Free Tier', price: '$0/mo', desc: 'Post jobs and hire candidates.', color: T.text3 };
    const limit = plan?.maxActiveJobs || 1;

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 28 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Recruiter</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Billing & Subscriptions</h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Manage company subscription billing and view platform transactions.</p>
            </div>

            {/* Current Plan Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 28 }} className="md:grid-cols-[1.5fr_1fr]">
                
                {/* Plan Card */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>Current Plan</span>
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
                        <span>Plan Status: <strong style={{ color: T.green }}>Active</strong></span>
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
                            Change Subscription Plan
                            <CreditCard width={13} height={13} />
                        </Link>
                    </div>
                </div>

                {/* Job Postings usage meter */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>Active Job Listings Usage</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12 }}>
                            <span style={{ fontSize: 36, fontWeight: 700, color: T.text1, lineHeight: 1 }}>{usageCount}</span>
                            <span style={{ fontSize: 16, color: T.text3 }}>/ {limit} postings</span>
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
                            <span>{Math.max(0, limit - usageCount)} remaining</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, fontSize: 11, color: T.text3, lineHeight: 1.4 }}>
                        <span style={{ flexShrink: 0, marginTop: 2 }}><CircleInfo width={11} height={11} /></span>
                        <span>Upgrade plan to raise active listing capacities.</span>
                    </div>
                </div>

            </div>

            {/* Invoices List Table */}
            <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: '20px 24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: T.text1 }}>Transaction History</h3>
                
                {subscriptions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                        <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>No invoice transactions registered.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                                    {['Transaction Date', 'Subscription Plan', 'Amount Paid', 'Reference ID', 'Status'].map(h => (
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
                                                <td style={{ padding: '12px', fontSize: 12, color: T.text1, fontWeight: 500 }}>Recruiter {cleanPlan}</td>
                                                <td style={{ padding: '12px', fontSize: 12, color: T.text1 }}>{amountDisplay}</td>
                                                <td style={{ padding: '12px', fontSize: 11, color: T.text3, fontFamily: 'monospace' }}>{subs.transactionId || '—'}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ borderRadius: 6, background: 'rgba(52,211,153,0.08)', padding: '2px 6px', fontSize: 10, fontWeight: 600, color: T.green }}>
                                                        Completed
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
