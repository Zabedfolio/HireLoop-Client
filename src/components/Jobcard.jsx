import React from 'react';
import Link from 'next/link';

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-[#1e1e1e] border border-[#2e2e2e] text-[#a0a0a0]',
    green:   'bg-[#0d2318] border border-[#1a4a2e] text-[#4ade80]',
    orange:  'bg-[#2a1a00] border border-[#4a3000] text-[#f59e0b]',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────

const SalaryIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const BoltIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" />
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FireIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C12 2 8 7 8 11a4 4 0 0 0 8 0c0-1.5-.5-3-1.5-4.5C15 8 16 9.5 16 11a4 4 0 0 0-4 4c0 2.21 1.79 4 4 4s4-1.79 4-4C20 8 12 2 12 2z"/>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────

const formatSalary = (min, max, currency = 'USD') => {
  const fmt = (n) => {
    const num = parseInt(n, 10);
    if (isNaN(num)) return null;
    if (num >= 1000) return `${Math.round(num / 1000)}k`;
    return `${num}`;
  };
  const symbol = currency === 'BDT' ? '৳' : '$';
  const fMin = fmt(min);
  const fMax = fmt(max);
  if (!fMin && !fMax) return null;
  if (!fMin) return `${symbol}${fMax}`;
  if (!fMax) return `${symbol}${fMin}`;
  return `${symbol}${fMin} – ${symbol}${fMax}`;
};

const fmtDate = (raw) => {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d)) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const isExpiringSoon = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline) - new Date() < 7 * 24 * 60 * 60 * 1000;
};

const renderTypeBadge = (jobType) => {
  const type = jobType?.toLowerCase().replace(/[-_\s]+/g, '');
  const label =
    type === 'fulltime'  ? 'Full-time' :
    type === 'contract'  ? 'Contract'  :
    type === 'freelance' ? 'Freelance' :
    type === 'hybrid'    ? 'Hybrid'    : jobType;
  const icon = type === 'hybrid' ? <MapPinIcon /> : <ClockIcon />;
  return <Badge variant="default">{icon} {label}</Badge>;
};

// ─── Component ────────────────────────────────────────────────────────────

const JobCard = ({
  _id,
  job_title,
  job_type,
  min_salary,
  max_salary,
  currency,
  location,
  companyName,
  companyLogo,
  deadline,
  createAt,
  isEasyApply = false,
  isHotJob    = false,
  isSenior    = false,
}) => {
  const jobId       = _id?.$oid ?? _id ?? 'unknown';
  const postedDate  = fmtDate(createAt?.$date ?? createAt);
  const deadlineDate = fmtDate(deadline);
  const salary      = formatSalary(min_salary, max_salary, currency);
  const soonExpiry  = isExpiringSoon(deadline);

  return (
    <Link href={`/browse-jobs/${jobId}`} className="block group">
      <div className="relative bg-[#111111] border border-[#222222] rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition-all duration-200 hover:border-[#333333] hover:bg-[#161616] cursor-pointer">

        {/* Company Logo */}
        <div className="flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
          {companyLogo ? (
            <img src={companyLogo} alt={`${companyName} logo`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1e3a2f] to-[#0d1f1a] flex items-center justify-center">
              <span className="text-[#4ade80] font-bold text-base sm:text-lg">
                {companyName?.[0] ?? '?'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-white text-base sm:text-lg font-semibold leading-snug group-hover:text-[#e0e0e0] transition-colors pr-6 sm:pr-0">
            {job_title}
          </h3>

          {/* Company & Location */}
          <p className="text-[#666666] text-xs sm:text-sm mt-0.5 truncate">
            <span className="text-[#888888]">{companyName}</span>
            {location && (
              <>
                <span className="mx-1.5 text-[#444444]">•</span>
                <span>{location}</span>
              </>
            )}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {salary && (
              <Badge>
                <SalaryIcon />
                {salary}
              </Badge>
            )}
            {renderTypeBadge(job_type)}
            {isSenior    && <Badge><StarIcon /> Senior</Badge>}
            {isEasyApply && <Badge variant="green"><BoltIcon /> Easy Apply</Badge>}
            {isHotJob    && <Badge variant="orange"><FireIcon /> Hot Job</Badge>}
          </div>

          {/* Dates */}
          {(postedDate || deadlineDate) && (
            <div className="flex flex-wrap items-center gap-3 mt-2.5">
              {postedDate && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#555555]">
                  <CalendarIcon />
                  Posted {postedDate}
                </span>
              )}
              {deadlineDate && (
                <span className={`inline-flex items-center gap-1 text-[11px] ${soonExpiry ? 'text-rose-400/80' : 'text-[#555555]'}`}>
                  <CalendarIcon />
                  Deadline {deadlineDate}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bookmark */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-4 right-4 sm:static sm:flex-shrink-0 text-[#444444] hover:text-[#888888] transition-colors p-1"
          aria-label="Save job"
        >
          <BookmarkIcon />
        </button>
      </div>
    </Link>
  );
};

export default JobCard;