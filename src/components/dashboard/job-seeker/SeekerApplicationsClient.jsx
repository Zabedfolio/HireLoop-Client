'use client';

import React, { useMemo, useState } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatRelative = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';

  const diffMs = Date.now() - date.getTime();
  const sec  = Math.floor(diffMs / 1000);
  const min  = Math.floor(sec / 60);
  const hr   = Math.floor(min / 60);
  const day  = Math.floor(hr / 24);
  const wk   = Math.floor(day / 7);
  const mo   = Math.floor(day / 30);
  const yr   = Math.floor(day / 365);

  if (sec < 60)  return 'Just now';
  if (min < 60)  return `${min} minute${min !== 1 ? 's' : ''} ago`;
  if (hr  < 24)  return `${hr} hour${hr !== 1 ? 's' : ''} ago`;
  if (day < 7)   return `${day} day${day !== 1 ? 's' : ''} ago`;
  if (wk  < 5)   return `${wk} week${wk !== 1 ? 's' : ''} ago`;
  if (mo  < 12)  return `${mo} month${mo !== 1 ? 's' : ''} ago`;
  return `${yr} year${yr !== 1 ? 's' : ''} ago`;
};

const formatExactDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return '—'; }
};

// Handles both raw Mongo docs ({ $oid: '...' } / { $date: '...' }) and
// already-serialized plain strings, so the table works with either shape.
const getId = (val) => {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.$oid) return val.$oid;
  if (typeof val.toString === 'function') return val.toString();
  return null;
};

const getDateValue = (val) => {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.$date) return val.$date;
  return val;
};

// ─── Design tokens (matches recruiter dashboard) ──────────────────────────────
const T = {
  bg0:    '#080809',
  bg1:    '#0D0D0E',
  bg2:    '#111113',
  border: 'rgba(255,255,255,0.07)',
  borderHover: 'rgba(255,255,255,0.13)',
  text1:  '#f4f4f5',
  text2:  '#a1a1aa',
  text3:  '#52525b',
  green:  '#34d399',
  amber:  '#fbbf24',
  red:    '#f87171',
  blue:   '#60a5fa',
  violet: '#a78bfa',
};

// ─── ApplicationStatusBadge ────────────────────────────────────────────────────
const STATUS_MAP = {
  applied:      { label: 'Applied',      dot: T.blue,   bg: 'rgba(96,165,250,0.08)',  color: T.blue,   ring: 'rgba(96,165,250,0.18)' },
  under_review: { label: 'Under Review', dot: T.amber,  bg: 'rgba(251,191,36,0.08)',  color: T.amber,  ring: 'rgba(251,191,36,0.18)' },
  shortlisted:  { label: 'Shortlisted',  dot: T.violet, bg: 'rgba(167,139,250,0.08)', color: T.violet, ring: 'rgba(167,139,250,0.18)' },
  rejected:     { label: 'Rejected',     dot: T.red,    bg: 'rgba(248,113,113,0.08)', color: T.red,    ring: 'rgba(248,113,113,0.18)' },
  offered:      { label: 'Offered',      dot: T.green,  bg: 'rgba(52,211,153,0.08)',  color: T.green,  ring: 'rgba(52,211,153,0.18)' },
};

const normalizeStatus = (status) => (status ?? 'applied').toString().toLowerCase().replace(/\s+/g, '_');

const ApplicationStatusBadge = ({ status }) => {
  const s = normalizeStatus(status);
  const c = STATUS_MAP[s] ?? STATUS_MAP.applied;
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

// ─── View Details Button ───────────────────────────────────────────────────────
const ViewDetailsButton = ({ jobId }) => (
  <a
    href={jobId ? `/jobs/${jobId}` : '#'}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      borderRadius: 8, border: `1px solid ${T.border}`,
      background: 'rgba(255,255,255,0.02)',
      padding: '6px 12px',
      fontSize: 12, fontWeight: 600, color: T.text1,
      textDecoration: 'none', whiteSpace: 'nowrap',
      transition: 'background 0.12s, border-color 0.12s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = T.borderHover; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = T.border; }}
  >
    View details
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </a>
);

// ─── Company Cell ───────────────────────────────────────────────────────────────
const CompanyCell = ({ name, logo }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    {logo ? (
      <img
        src={logo}
        alt=""
        style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: T.bg2 }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    ) : (
      <div style={{ width: 22, height: 22, borderRadius: 6, background: T.bg2, border: `1px solid ${T.border}`, flexShrink: 0 }} />
    )}
    <span style={{ fontSize: 12, color: T.text2 }}>{name ?? '—'}</span>
  </div>
);

// ─── Empty State ────────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 24px', textAlign: 'center' }}>
    <div style={{ width: 60, height: 60, borderRadius: 14, border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke={T.text3} strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: T.text1 }}>No applications yet</h3>
    <p style={{ margin: 0, fontSize: 12, color: T.text3, maxWidth: 280 }}>Once you apply to a job, it'll show up here so you can track its status.</p>
  </div>
);

// ─── Mobile Card ────────────────────────────────────────────────────────────────
const MobileApplicationCard = ({ app }) => (
  <div style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.text1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {app.jobTitle ?? 'Untitled role'}
        </p>
        <div style={{ marginTop: 4 }}>
          <CompanyCell name={app.companyName} logo={app.companyLogo} />
        </div>
      </div>
      <ApplicationStatusBadge status={app.status} />
    </div>

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
      <span style={{ fontSize: 11, color: T.text3 }} title={formatExactDate(getDateValue(app.createAt))}>
        {formatRelative(getDateValue(app.createAt))}
      </span>
      <ViewDetailsButton jobId={getId(app.jobId)} />
    </div>
  </div>
);

// ─── Applications Table ──────────────────────────────────────────────────────────
const SeekerApplicationsTable = ({ applications = [] }) => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sorted = useMemo(
    () => [...applications].sort(
      (a, b) => new Date(getDateValue(b.createAt) ?? 0) - new Date(getDateValue(a.createAt) ?? 0)
    ),
    [applications]
  );

  const COLS = ['Job Title', 'Company', 'Date Applied', 'Status', ''];

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${T.border}`,
        padding: '18px 22px',
      }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Seeker</p>
        <h2 style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 600, color: T.text1 }}>My applications</h2>
      </div>

      {applications.length === 0 ? <EmptyState /> : (
        <>
          {isMobile ? (
            <div>
              {sorted.map((app) => (
                <MobileApplicationCard key={getId(app._id)} app={app} />
              ))}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                    {COLS.map((h, i) => (
                      <th key={i} style={{ padding: '9px 20px', textAlign: 'left', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3, width: i === 4 ? 110 : 'auto' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((app, i) => (
                    <tr
                      key={getId(app._id) ?? i}
                      style={{ borderBottom: `1px solid ${T.border}`, transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.018)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '13px 20px' }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.text1 }}>
                          {app.jobTitle ?? 'Untitled role'}
                        </p>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <CompanyCell name={app.companyName} logo={app.companyLogo} />
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <span style={{ fontSize: 12, color: T.text2 }} title={formatExactDate(getDateValue(app.createAt))}>
                          {formatRelative(getDateValue(app.createAt))}
                        </span>
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <ViewDetailsButton jobId={getId(app.jobId)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div style={{
            borderTop: `1px solid rgba(255,255,255,0.05)`,
            padding: '11px 22px',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: T.text3 }}>
              {applications.length} application{applications.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const SeekerApplicationsClient = ({ applications }) => {
  return (
    <div style={{ minHeight: '100vh', background: T.bg0, padding: '32px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Page header */}
        <div style={{
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 22, marginBottom: 24,
        }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Dashboard</p>
          <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Applications</h1>
          <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Track the status of every job you've applied to.</p>
        </div>

        <SeekerApplicationsTable applications={applications} />
      </div>
    </div>
  );
};

export default SeekerApplicationsClient;
export { SeekerApplicationsTable };