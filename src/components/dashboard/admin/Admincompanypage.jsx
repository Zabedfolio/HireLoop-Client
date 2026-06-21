'use client';

import { updateCompany } from "@/lib/actions/companies";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";

// ── Design tokens (matching your Jobs page) ──────────────────────────────────
const T = {
    bg0: '#080809',
    bg1: '#0D0D0E',
    bg2: '#111113',
    border: 'rgba(255,255,255,0.07)',
    borderHover: 'rgba(255,255,255,0.13)',
    text1: '#f4f4f5',
    text2: '#a1a1aa',
    text3: '#52525b',
    green: '#34d399',
    amber: '#fbbf24',
    red: '#f87171',
    blue: '#60a5fa',
};



// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (d) => {
    if (!d) return '—';
    try {
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return '—'; }
};

// Real API field: createAt (not date_submitted)
const getDate = (c) => c.createAt ?? c.createdAt ?? c.date_submitted ?? null;

const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
    pending: { label: 'Pending', dot: T.amber, bg: 'rgba(251,191,36,0.08)', color: T.amber, ring: 'rgba(251,191,36,0.18)' },
    approved: { label: 'Approved', dot: T.green, bg: 'rgba(52,211,153,0.08)', color: T.green, ring: 'rgba(52,211,153,0.18)' },
    rejected: { label: 'Rejected', dot: T.red, bg: 'rgba(248,113,113,0.08)', color: T.red, ring: 'rgba(248,113,113,0.18)' },
};

const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase() ?? 'pending';
    const c = STATUS_MAP[s] ?? STATUS_MAP.pending;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            borderRadius: 9999, padding: '3px 9px',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
            background: c.bg, color: c.color,
            boxShadow: `0 0 0 1px ${c.ring}`,
            whiteSpace: 'nowrap',
        }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
            {c.label}
        </span>
    );
};

// ── Industry pill ─────────────────────────────────────────────────────────────
const IndustryPill = ({ industry }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center',
        borderRadius: 6, padding: '2px 7px',
        fontSize: 11, fontWeight: 500, textTransform: 'capitalize',
        background: 'rgba(255,255,255,0.04)',
        color: T.text2,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.07)`,
        whiteSpace: 'nowrap',
    }}>
        {industry ?? 'General'}
    </span>
);

// ── Company avatar ────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
    { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
    { bg: 'rgba(52,211,153,0.15)', color: '#34d399' },
    { bg: 'rgba(251,146,60,0.15)', color: '#fb923c' },
    { bg: 'rgba(244,114,182,0.15)', color: '#f472b6' },
    { bg: 'rgba(34,211,238,0.15)', color: '#22d3ee' },
];

const Avatar = ({ name, logo }) => {
    const initials = getInitials(name);
    const colorIdx = name ? name.charCodeAt(0) % AVATAR_COLORS.length : 0;
    const c = AVATAR_COLORS[colorIdx];
    if (logo) {
        return (
            <img src={logo} alt={name} style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
        );
    }
    return (
        <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: c.bg, color: c.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
        }}>
            {initials}
        </div>
    );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, accent, icon, sub }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        borderRadius: 14, border: `1px solid ${T.border}`,
        background: T.bg1, padding: '16px 18px', minWidth: 0,
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>{label}</p>
            {icon && (
                <span style={{ color: accent ?? T.text3, opacity: 0.6 }}>{icon}</span>
            )}
        </div>
        <div style={{ marginTop: 14 }}>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 600, color: accent ?? T.text1, lineHeight: 1 }}>{value}</p>
            {sub && <p style={{ margin: '4px 0 0', fontSize: 11, color: T.text3 }}>{sub}</p>}
        </div>
    </div>
);

// ── Action buttons ────────────────────────────────────────────────────────────
const ActionButtons = ({ status, onApprove, onReject }) => {
    const s = status?.toLowerCase();
    return (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            {s !== 'approved' && (
                <button
                    onClick={(e) => { e.stopPropagation(); onApprove(); }}
                    style={{
                        padding: '5px 12px', borderRadius: 8,
                        border: '1px solid rgba(52,211,153,0.3)',
                        background: 'rgba(52,211,153,0.07)',
                        color: T.green, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        transition: 'background 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.15)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.07)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'; }}
                >
                    Approve
                </button>
            )}
            {s !== 'rejected' && (
                <button
                    onClick={(e) => { e.stopPropagation(); onReject(); }}
                    style={{
                        padding: '5px 12px', borderRadius: 8,
                        border: '1px solid rgba(248,113,113,0.3)',
                        background: 'rgba(248,113,113,0.07)',
                        color: T.red, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        transition: 'background 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.15)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.07)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
                >
                    Reject
                </button>
            )}
        </div>
    );
};

// ── Table row ─────────────────────────────────────────────────────────────────
const CompanyRow = ({ company, onApprove, onReject }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <tr
            style={{
                borderBottom: `1px solid ${T.border}`,
                background: hovered ? 'rgba(255,255,255,0.018)' : 'transparent',
                transition: 'background 0.1s',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Company name + avatar */}
            <td style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={company.company_name} logo={company.logo} />
                    <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.text1 }}>
                            {company.company_name}
                        </p>
                        {company.location && (
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>{company.location}</p>
                        )}
                    </div>
                </div>
            </td>

            {/* Industry */}
            <td style={{ padding: '14px 20px' }}>
                <IndustryPill industry={company.industry} />
            </td>

            {/* Website */}
            <td style={{ padding: '14px 20px' }}>
                {company.website_url
                    ? <a href={company.website_url.startsWith('http') ? company.website_url : `https://${company.website_url}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.blue, textDecoration: 'none' }}>{company.website_url}</a>
                    : <span style={{ fontSize: 12, color: T.text3 }}>—</span>
                }
            </td>

            {/* Employees */}
            <td style={{ padding: '14px 20px' }}>
                <span style={{ fontSize: 12, color: T.text2 }}>{company.employee_count ?? '—'}</span>
            </td>

            {/* Applications */}
            <td style={{ padding: '14px 20px' }}>
                <span style={{ fontSize: 12, color: T.text2 }}>{company.jobCount ?? '—'}</span>
            </td>

            {/* Status */}
            <td style={{ padding: '14px 20px' }}>
                <StatusBadge status={company.status} />
            </td>

            {/* Date registered */}
            <td style={{ padding: '14px 20px' }}>
                <span style={{ fontSize: 12, color: T.text2 }}>{formatDate(getDate(company))}</span>
            </td>

            {/* Actions */}
            <td style={{ padding: '10px 20px' }}>
                <ActionButtons status={company.status} onApprove={onApprove} onReject={onReject} />
            </td>
        </tr>
    );
};

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ search }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={T.text3} strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        </div>
        <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: T.text1 }}>
            {search ? `No companies match "${search}"` : 'No company registrations yet'}
        </h3>
        <p style={{ margin: 0, fontSize: 12, color: T.text3, maxWidth: 260 }}>
            {search ? 'Try a different search term.' : 'Company registration requests will appear here.'}
        </p>
    </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const AdminCompanyPage = ({ companies: initialCompanies = [] }) => {
    const [companies, setCompanies] = useState(initialCompanies);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Derived stats — always computed from live state
    const stats = useMemo(() => ({
        total: companies.length,
        pending: companies.filter(c => c.status === 'pending').length,
        approved: companies.filter(c => c.status === 'approved').length,
        rejected: companies.filter(c => c.status === 'rejected').length,
    }), [companies]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return companies.filter(c => {
            const matchSearch =
                (c.company_name?.toLowerCase() ?? '').includes(q) ||
                (c.industry?.toLowerCase() ?? '').includes(q) ||
                (c.location?.toLowerCase() ?? '').includes(q) ||
                (c.website_url?.toLowerCase() ?? '').includes(q);
            const matchStatus = filterStatus === 'all' || c.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [companies, search, filterStatus]);

    const sorted = useMemo(
        () => [...filtered].sort((a, b) => new Date(getDate(b) ?? 0) - new Date(getDate(a) ?? 0)),
        [filtered]
    );

    const handleApprove = async (id) => {
        const company = companies.find(c => c._id === id);
        const result = await updateCompany(id, { status: 'approved' });
        console.log('Approve result:', result);

        setCompanies(prev => prev.map(c => (c._id === id ? { ...c, status: 'approved' } : c)));
        toast.success(`${company?.company_name} has been approved`);
    };

    const handleReject = async (id) => {
        const company = companies.find(c => c._id === id);
        const result = await updateCompany(id, { status: 'rejected' });
        console.log('Reject result:', result);

        setCompanies(prev => prev.map(c => (c._id === id ? { ...c, status: 'rejected' } : c)));
        toast.error(`${company?.company_name} has been rejected`);
    };

    const COLS = ['Company', 'Industry', 'Website', 'Employees', 'Applications', 'Status', 'Registered', 'Actions'];

    const STATUS_FILTER_OPTIONS = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, padding: '32px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: 1140, margin: '0 auto' }}>

                {/* Page header */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 16,
                    alignItems: 'flex-end', justifyContent: 'space-between',
                    borderBottom: `1px solid ${T.border}`,
                    paddingBottom: 22, marginBottom: 24,
                }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Admin</p>
                        <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Company Registrations</h1>
                        <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Review and manage corporate entity access requests for the HireLoop ecosystem.</p>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        {/* Filter dropdown */}
                        <div style={{ position: 'relative' }}>
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                style={{
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    borderRadius: 10, border: `1px solid ${T.border}`,
                                    background: T.bg1, color: T.text2,
                                    padding: '8px 32px 8px 14px',
                                    fontSize: 12, fontWeight: 500, cursor: 'pointer',
                                    outline: 'none',
                                }}
                            >
                                {STATUS_FILTER_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={T.text3} strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        <button
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 7,
                                borderRadius: 10, background: T.text1, border: 'none',
                                padding: '9px 16px', fontSize: 12, fontWeight: 600, color: '#000',
                                cursor: 'pointer', whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#d4d4d8'}
                            onMouseLeave={e => e.currentTarget.style.background = T.text1}
                        >
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Register New
                        </button>
                    </div>
                </div>

                {/* Stats — dynamic, at top */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 22 }}>
                    <StatCard
                        label="Total Companies"
                        value={stats.total}
                        icon={<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /><path strokeLinecap="round" strokeLinejoin="round" d="M1 21h22" /></svg>}
                    />
                    <StatCard
                        label="Pending Review"
                        value={stats.pending}
                        accent={T.amber}
                        sub="awaiting decision"
                        icon={<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <StatCard
                        label="Approved Partners"
                        value={stats.approved}
                        accent={T.green}
                        sub="active in ecosystem"
                        icon={<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <StatCard
                        label="Total Rejections"
                        value={stats.rejected}
                        accent={T.red}
                        sub="declined requests"
                        icon={<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.93 4.93l14.14 14.14" /></svg>}
                    />
                </div>

                {/* Table card */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, overflow: 'visible' }}>

                    {/* Table header */}
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 12,
                        alignItems: 'center', justifyContent: 'space-between',
                        borderBottom: `1px solid ${T.border}`,
                        padding: '18px 22px',
                    }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Registry</p>
                            <h2 style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 600, color: T.text1 }}>All companies</h2>
                        </div>

                        {/* Search */}
                        <div style={{ position: 'relative', width: '100%', maxWidth: 268 }}>
                            <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                                width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={T.text3} strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search companies…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    borderRadius: 10, border: `1px solid ${T.border}`,
                                    background: 'rgba(255,255,255,0.02)',
                                    padding: '8px 30px 8px 33px',
                                    fontSize: 12, color: T.text1, outline: 'none',
                                }}
                                onFocus={e => { e.target.style.borderColor = T.borderHover; e.target.style.background = 'rgba(255,255,255,0.035)'; }}
                                onBlur={e => { e.target.style.borderColor = T.border; e.target.style.background = 'rgba(255,255,255,0.02)'; }}
                            />
                            {search && (
                                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: T.text3, cursor: 'pointer', padding: 0, display: 'flex' }}>
                                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table body */}
                    <div style={{ overflowX: 'auto' }}>
                        {companies.length === 0 ? (
                            <EmptyState />
                        ) : sorted.length === 0 ? (
                            <EmptyState search={search} />
                        ) : (
                            <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                                        {COLS.map((h, i) => (
                                            <th key={i} style={{
                                                padding: '9px 20px', textAlign: i === COLS.length - 1 ? 'right' : 'left',
                                                fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                                                letterSpacing: '0.1em', color: T.text3,
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sorted.map((company) => (
                                        <CompanyRow
                                            key={company._id}
                                            company={company}
                                            onApprove={() => handleApprove(company._id)}
                                            onReject={() => handleReject(company._id)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 8,
                        alignItems: 'center', justifyContent: 'space-between',
                        borderTop: `1px solid rgba(255,255,255,0.05)`,
                        padding: '11px 22px',
                    }}>
                        <p style={{ margin: 0, fontSize: 11, color: T.text3 }}>
                            {sorted.length < companies.length
                                ? `Showing ${sorted.length} of ${companies.length} companies`
                                : `${companies.length} compan${companies.length !== 1 ? 'ies' : 'y'} total`}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                            <span style={{ fontSize: 11, color: T.text3 }}><span style={{ fontWeight: 600, color: T.amber }}>{stats.pending}</span> pending</span>
                            <span style={{ fontSize: 11, color: T.text3 }}><span style={{ fontWeight: 600, color: T.green }}>{stats.approved}</span> approved</span>
                            <span style={{ fontSize: 11, color: T.text3 }}><span style={{ fontWeight: 600, color: T.red }}>{stats.rejected}</span> rejected</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminCompanyPage;