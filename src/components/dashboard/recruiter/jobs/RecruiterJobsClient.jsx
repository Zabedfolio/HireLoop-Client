'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return '—'; }
};

const formatSalary = (min, max, currency = 'USD') => {
  const fmt = (n) => {
    const num = Number(n);
    if (!num) return null;
    return num >= 1000
      ? `${currency === 'USD' ? '$' : currency}${(num / 1000).toFixed(0)}k`
      : `${currency === 'USD' ? '$' : currency}${num}`;
  };
  const lo = fmt(min), hi = fmt(max);
  if (lo && hi) return `${lo} – ${hi}`;
  if (hi) return `Up to ${hi}`;
  if (lo) return `From ${lo}`;
  return '—';
};

const isDeadlineSoon = (d) => {
  if (!d) return false;
  const diff = new Date(d).getTime() - Date.now();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
};

const isDeadlinePast = (d) => {
  if (!d) return false;
  return new Date(d).getTime() < Date.now();
};

const parseList = (str) => {
  if (!str) return [];
  return str.split(/\.\s+/).map(s => s.replace(/\.$/, '').trim()).filter(Boolean);
};

// ─── Design tokens ────────────────────────────────────────────────────────────
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
};

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  active:   { label: 'Active',   dot: T.green, bg: 'rgba(52,211,153,0.08)',   color: T.green, ring: 'rgba(52,211,153,0.18)' },
  closed:   { label: 'Closed',   dot: T.red,   bg: 'rgba(248,113,113,0.08)', color: T.red,   ring: 'rgba(248,113,113,0.18)' },
  draft:    { label: 'Draft',    dot: T.amber, bg: 'rgba(251,191,36,0.08)',  color: T.amber, ring: 'rgba(251,191,36,0.18)' },
  archived: { label: 'Archived', dot: T.text3, bg: 'rgba(82,82,91,0.08)',   color: T.text2, ring: 'rgba(82,82,91,0.18)' },
};

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() ?? 'draft';
  const c = STATUS_MAP[s] ?? STATUS_MAP.draft;
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

// ─── CategoryPill ─────────────────────────────────────────────────────────────
const CAT_COLORS = {
  engineering: { bg: 'rgba(96,165,250,0.1)',  color: '#60a5fa', ring: 'rgba(96,165,250,0.2)' },
  design:      { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', ring: 'rgba(167,139,250,0.2)' },
  marketing:   { bg: 'rgba(251,146,60,0.1)',  color: '#fb923c', ring: 'rgba(251,146,60,0.2)' },
  sales:       { bg: 'rgba(244,114,182,0.1)', color: '#f472b6', ring: 'rgba(244,114,182,0.2)' },
  hr:          { bg: 'rgba(45,212,191,0.1)',  color: '#2dd4bf', ring: 'rgba(45,212,191,0.2)' },
  product:     { bg: 'rgba(34,211,238,0.1)',  color: '#22d3ee', ring: 'rgba(34,211,238,0.2)' },
  finance:     { bg: 'rgba(163,230,53,0.1)',  color: '#a3e635', ring: 'rgba(163,230,53,0.2)' },
  operations:  { bg: 'rgba(249,168,212,0.1)', color: '#f9a8d4', ring: 'rgba(249,168,212,0.2)' },
};

const CategoryPill = ({ category }) => {
  const c = CAT_COLORS[category?.toLowerCase()] ?? { bg: 'rgba(82,82,91,0.1)', color: T.text2, ring: 'rgba(82,82,91,0.2)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      borderRadius: 6, padding: '2px 7px',
      fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
      background: c.bg, color: c.color,
      boxShadow: `0 0 0 1px ${c.ring}`,
      whiteSpace: 'nowrap',
    }}>
      {category ?? 'General'}
    </span>
  );
};

// ─── RemoteBadge ──────────────────────────────────────────────────────────────
const RemoteBadge = ({ is_remote }) => {
  if (is_remote !== 'true' && is_remote !== true) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      borderRadius: 6, padding: '2px 7px',
      fontSize: 11, fontWeight: 600,
      background: 'rgba(52,211,153,0.08)',
      color: T.green,
      boxShadow: '0 0 0 1px rgba(52,211,153,0.18)',
      whiteSpace: 'nowrap',
    }}>
      <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
      Remote
    </span>
  );
};

// ─── Deadline cell ────────────────────────────────────────────────────────────
const DeadlineCell = ({ date }) => {
  if (!date) return <span style={{ color: T.text3 }}>—</span>;
  const soon = isDeadlineSoon(date);
  const past = isDeadlinePast(date);
  return (
    <span style={{
      fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5,
      color: past ? T.red : soon ? T.amber : T.text2,
      textDecoration: past ? 'line-through' : 'none',
    }}>
      {soon && !past && <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.amber, flexShrink: 0 }} />}
      {formatDate(date)}
    </span>
  );
};

// ─── Expandable Detail Panel ──────────────────────────────────────────────────
const DetailPanel = ({ job }) => {
  const reqs  = parseList(job.requirements);
  const resps = parseList(job.responsibilities);
  const bens  = parseList(job.benefits);

  const Section = ({ title, items, icon }) => {
    if (!items.length) return null;
    return (
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3, display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon}
          {title}
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: T.text2, lineHeight: 1.5 }}>
              <span style={{ flexShrink: 0, marginTop: 5, width: 4, height: 4, borderRadius: '50%', background: T.text3 }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <tr>
      <td colSpan={8} style={{ padding: 0, background: 'rgba(255,255,255,0.015)' }}>
        <div style={{
          padding: '20px 24px 24px',
          borderBottom: `1px solid ${T.border}`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}>
          <Section
            title="Requirements"
            items={reqs}
            icon={<svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <Section
            title="Responsibilities"
            items={resps}
            icon={<svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <Section
            title="Benefits"
            items={bens}
            icon={<svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>}
          />
        </div>
      </td>
    </tr>
  );
};

// ─── Action Menu ──────────────────────────────────────────────────────────────
const ActionMenu = ({ job, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const buttonRef = useRef(null);
  const id = job._id ?? job.id;

  const itemBase = {
    display: 'flex', alignItems: 'center', gap: 9,
    padding: '8px 12px', fontSize: 12, color: T.text2,
    cursor: 'pointer', background: 'transparent', border: 'none',
    width: '100%', textAlign: 'left', transition: 'background 0.1s',
  };

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.right - 140,
        zIndex: 99999,
        width: 156,
      });
    }
  }, [open]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-label="More actions"
        style={{
          width: 30, height: 30, borderRadius: 8, border: 'none',
          background: 'transparent', color: T.text3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background 0.12s, color 0.12s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = T.text1; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.text3; }}
      >
        <svg width="13" height="13" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      </button>

      {open && (
        <div style={{
          ...menuStyle,
          overflow: 'hidden',
          borderRadius: 10, border: `1px solid ${T.border}`,
          background: '#151516', padding: '3px 0',
          boxShadow: '0 16px 32px rgba(0,0,0,0.5)',
        }}>
          {[
            { label: 'View details', icon: <EyeIcon /> },
            { label: 'Edit job',     icon: <EditIcon /> },
          ].map(({ label, icon }) => (
            <button
              key={label}
              style={itemBase}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {icon}{label}
            </button>
          ))}
          <div style={{ height: '0.5px', background: T.border, margin: '3px 0' }} />
          <button
            style={{ ...itemBase, color: T.red }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            onClick={() => onDelete?.(id)}
          >
            <TrashIcon />Delete
          </button>
        </div>
      )}
    </div>
  );
};

const EyeIcon  = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EditIcon = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon= () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    borderRadius: 14, border: `1px solid ${T.border}`,
    background: T.bg1, padding: '16px 18px', minWidth: 0,
  }}>
    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>{label}</p>
    <div style={{ marginTop: 14 }}>
      <p style={{ margin: 0, fontSize: 26, fontWeight: 600, color: accent ?? T.text1, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 11, color: T.text3 }}>{sub}</p>}
    </div>
  </div>
);

// ─── Mobile Card ──────────────────────────────────────────────────────────────
const MobileJobCard = ({ job, expanded, onToggle, onDelete }) => (
  <div style={{ borderBottom: `1px solid ${T.border}` }}>
    <div
      style={{ padding: '14px 16px', cursor: 'pointer' }}
      onClick={onToggle}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.text1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {job.job_title ?? 'Untitled'}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>{job.location ?? '—'}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, color: T.text3, transition: 'transform 0.2s', display: 'inline-block', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
          <ActionMenu job={job} onDelete={onDelete} />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        <StatusBadge status={job.status} />
        <CategoryPill category={job.job_category} />
        <RemoteBadge is_remote={job.is_remote} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: T.green }}>
          {formatSalary(job.min_salary, job.max_salary, job.currency)}
        </span>
        <DeadlineCell date={job.deadline} />
      </div>
    </div>

    {expanded && (
      <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${T.border}` }}>
        {[
          { title: 'Requirements',    items: parseList(job.requirements) },
          { title: 'Responsibilities', items: parseList(job.responsibilities) },
          { title: 'Benefits',        items: parseList(job.benefits) },
        ].map(({ title, items }) => items.length > 0 && (
          <div key={title} style={{ marginTop: 14 }}>
            <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>{title}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 7, fontSize: 11, color: T.text2, lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0, marginTop: 5, width: 3, height: 3, borderRadius: '50%', background: T.text3 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── Table Row ────────────────────────────────────────────────────────────────
const TableRow = ({ job, expanded, onToggle, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <>
      <tr
        style={{
          borderBottom: expanded ? 'none' : `1px solid ${T.border}`,
          background: expanded ? 'rgba(255,255,255,0.02)' : hovered ? 'rgba(255,255,255,0.018)' : 'transparent',
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onToggle}
      >
        {/* Role */}
        <td style={{ padding: '13px 20px' }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.text1 }}>
            {job.job_title ?? 'Untitled'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <p style={{ margin: 0, fontSize: 11, color: T.text3 }}>{job.location ?? '—'}</p>
            <RemoteBadge is_remote={job.is_remote} />
          </div>
        </td>

        {/* Category */}
        <td style={{ padding: '13px 20px' }}>
          <CategoryPill category={job.job_category} />
        </td>

        {/* Type */}
        <td style={{ padding: '13px 20px' }}>
          <span style={{ fontSize: 12, color: T.text2, textTransform: 'capitalize' }}>
            {(job.job_type ?? 'full_time').replace(/_/g, ' ')}
          </span>
        </td>

        {/* Salary */}
        <td style={{ padding: '13px 20px' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.green, whiteSpace: 'nowrap' }}>
            {formatSalary(job.min_salary, job.max_salary, job.currency)}
          </span>
        </td>

        {/* Status */}
        <td style={{ padding: '13px 20px' }}>
          <StatusBadge status={job.status} />
        </td>

        {/* Applications */}
        <td style={{ padding: '13px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text1 }}>
              {job.applications_count ?? 0}
            </span>
            {(job.applications_count ?? 0) > 0 && (
              <span style={{ fontSize: 11, color: T.text3 }}>applicants</span>
            )}
          </div>
        </td>

        {/* Deadline */}
        <td style={{ padding: '13px 20px' }}>
          <DeadlineCell date={job.deadline} />
        </td>

        {/* Expand + Actions */}
        <td style={{ padding: '10px 12px' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              style={{
                width: 28, height: 28, border: 'none', background: 'transparent',
                color: T.text3, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6, transition: 'color 0.1s, background 0.1s',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s, color 0.1s',
              }}
              aria-label="Expand row"
              onMouseEnter={e => { e.currentTarget.style.color = T.text1; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.text3; e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ActionMenu job={job} onDelete={onDelete} />
          </div>
        </td>
      </tr>

      {expanded && <DetailPanel job={job} />}
    </>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 24px', textAlign: 'center' }}>
    <div style={{ width: 60, height: 60, borderRadius: 14, border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke={T.text3} strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
      </svg>
    </div>
    <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: T.text1 }}>No job listings yet</h3>
    <p style={{ margin: '0 0 24px', fontSize: 12, color: T.text3, maxWidth: 260 }}>Post your first role and start receiving applications.</p>
    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, borderRadius: 10, background: T.text1, border: 'none', padding: '9px 18px', fontSize: 13, fontWeight: 600, color: '#000', cursor: 'pointer' }}>
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
      Post a job
    </button>
  </div>
);

// ─── Jobs Table ───────────────────────────────────────────────────────────────
const JobsTable = ({ jobs = [] }) => {
  const [search,   setSearch]   = useState('');
  const [expanded, setExpanded] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [localJobs, setLocalJobs] = useState(jobs);

  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return localJobs.filter(j =>
      (j.job_title?.toLowerCase() ?? '').includes(q) ||
      (j.job_category?.toLowerCase() ?? '').includes(q) ||
      (j.location?.toLowerCase() ?? '').includes(q)
    );
  }, [localJobs, search]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.deadline ?? 0) - new Date(a.deadline ?? 0)),
    [filtered]
  );

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);
  const handleDelete = (id) => setLocalJobs(prev => prev.filter(j => (j._id ?? j.id) !== id));

  const totalApps  = localJobs.reduce((s, j) => s + (j.applications_count ?? 0), 0);
  const activeCount = localJobs.filter(j => j.status === 'active').length;

  const COLS = ['Role', 'Category', 'Type', 'Salary', 'Status', 'Applications', 'Deadline', ''];

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, overflow: 'visible' }}>

      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12,
        alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${T.border}`,
        padding: '18px 22px',
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Listings</p>
          <h2 style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 600, color: T.text1 }}>Open roles</h2>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: 268 }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={T.text3} strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search roles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              borderRadius: 10, border: `1px solid ${T.border}`,
              background: 'rgba(255,255,255,0.02)',
              padding: '8px 30px 8px 33px',
              fontSize: 12, color: T.text1,
              outline: 'none',
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

      {/* Body */}
      {localJobs.length === 0 ? <EmptyState /> : (
        <>
          {isMobile ? (
            <div>
              {sorted.length === 0
                ? <div style={{ padding: '48px 24px', textAlign: 'center', fontSize: 12, color: T.text3 }}>No jobs match <span style={{ color: T.text2 }}>"{search}"</span></div>
                : sorted.map((job, i) => {
                    const id = job._id ?? job.id ?? i;
                    return <MobileJobCard key={id} job={job} expanded={expanded === id} onToggle={() => toggle(id)} onDelete={handleDelete} />;
                  })
              }
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                    {COLS.map((h, i) => (
                      <th key={i} style={{ padding: '9px 20px', textAlign: 'left', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3, width: i === 7 ? 76 : 'auto' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.length === 0
                    ? <tr><td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center', fontSize: 12, color: T.text3 }}>No jobs match <span style={{ color: T.text2 }}>"{search}"</span></td></tr>
                    : sorted.map((job, i) => {
                        const id = job._id ?? job.id ?? i;
                        return <TableRow key={id} job={job} expanded={expanded === id} onToggle={() => toggle(id)} onDelete={handleDelete} />;
                      })
                  }
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between',
            borderTop: `1px solid rgba(255,255,255,0.05)`,
            padding: '11px 22px',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: T.text3 }}>
              {sorted.length < localJobs.length ? `Showing ${sorted.length} of ${localJobs.length} jobs` : `${localJobs.length} job${localJobs.length !== 1 ? 's' : ''} total`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ fontSize: 11, color: T.text3 }}><span style={{ fontWeight: 600, color: T.green }}>{activeCount}</span> active</span>
              <span style={{ fontSize: 11, color: T.text3 }}><span style={{ fontWeight: 600, color: T.text1 }}>{totalApps}</span> applications</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const RecruiterJobsClient = ({ jobs }) => {
  const companyId = 'company_123';

  const totalApps  = jobs.reduce((s, j) => s + (j.applications_count ?? 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const draftJobs  = jobs.filter(j => j.status === 'draft').length;
  const remoteJobs = jobs.filter(j => j.is_remote === 'true' || j.is_remote === true).length;

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
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Recruiter</p>
            <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Jobs</h1>
            <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Manage listings and track candidate applications.</p>
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
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Post a job
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 22 }}>
          <StatCard label="Total listings" value={jobs.length} />
          <StatCard label="Active"          value={activeJobs}  accent={T.green}  sub="currently open" />
          <StatCard label="Drafts"          value={draftJobs}   accent={T.amber}  sub="unpublished" />
          <StatCard label="Remote roles"    value={remoteJobs}  accent={T.blue}   sub="flexible location" />
          <StatCard label="Applications"    value={totalApps}   sub="across all jobs" />
        </div>

        {/* Table */}
        <JobsTable jobs={jobs} />
      </div>
    </div>
  );
};

export default RecruiterJobsClient;