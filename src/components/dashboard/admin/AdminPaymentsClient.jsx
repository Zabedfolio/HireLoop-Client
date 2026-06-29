'use client';

import React, { useMemo } from 'react';
import { CreditCard, CircleDollar, Person, Calendar } from '@gravity-ui/icons';

const T = {
    bg0: '#080809',
    bg1: '#0D0D0E',
    bg2: '#111113',
    border: 'rgba(255,255,255,0.07)',
    text1: '#f4f4f5',
    text2: '#a1a1aa',
    text3: '#52525b',
    blue: '#60a5fa',
    green: '#34d399',
    amber: '#fbbf24',
    violet: '#a78bfa',
};

export default function AdminPaymentsClient({ summary = {} }) {
    const { payments = [], totalRevenue = 0, monthlyRevenue = 0, activeSeekers = 0, activeRecruiters = 0 } = summary;

    const formattedTotalRevenue = useMemo(() => {
        return `$${(totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, [totalRevenue]);

    const formattedMonthlyRevenue = useMemo(() => {
        return `$${(monthlyRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, [monthlyRevenue]);

    const STATS = [
        { label: 'Total Revenue', value: formattedTotalRevenue, icon: CircleDollar, color: T.green },
        { label: 'Monthly Revenue (30d)', value: formattedMonthlyRevenue, icon: Calendar, color: T.blue },
        { label: 'Active Pro/Premium Seekers', value: activeSeekers, icon: Person, color: T.violet },
        { label: 'Active Growth/Ent. Recruiters', value: activeRecruiters, icon: Person, color: T.amber },
    ];

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 28 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Admin</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Transaction Log</h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Review Stripe subscription payments, totals, and premium member cohorts.</p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
                {STATS.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        style={{
                            borderRadius: 14, border: `1px solid ${T.border}`,
                            background: T.bg1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ margin: 0, fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>{label}</p>
                            <span style={{ color, opacity: 0.8 }}><Icon width={16} height={16} /></span>
                        </div>
                        <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text1, lineHeight: 1 }}>
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Invoices List Table */}
            <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: '20px 24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: T.text1 }}>Platform Invoices</h3>
                
                {payments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                        <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>No invoice transactions registered.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                                    {['Transaction Date', 'User Email', 'Purchased Plan', 'Amount Paid', 'Stripe Session ID', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: T.text3 }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...payments]
                                    .sort((a, b) => new Date(b.createdAt || b.createAt) - new Date(a.createdAt || a.createAt))
                                    .map((subs) => {
                                        const dateStr = subs.createdAt || subs.createAt ? new Date(subs.createdAt || subs.createAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                                        const amountDisplay = subs.amount ? `$${subs.amount.toFixed(2)}` : '$0.00';
                                        const cleanPlan = subs.planId?.replace(/_/g, ' ').toUpperCase() || 'FREE';

                                        return (
                                            <tr key={subs._id} style={{ borderBottom: `1px solid ${T.border}` }}>
                                                <td style={{ padding: '12px', fontSize: 12, color: T.text2 }}>{dateStr}</td>
                                                <td style={{ padding: '12px', fontSize: 12, color: T.text1 }}>{subs.email}</td>
                                                <td style={{ padding: '12px', fontSize: 12, color: T.text1, fontWeight: 500 }}>{cleanPlan}</td>
                                                <td style={{ padding: '12px', fontSize: 12, color: T.green, fontWeight: 600 }}>{amountDisplay}</td>
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

        </div>
    );
}
