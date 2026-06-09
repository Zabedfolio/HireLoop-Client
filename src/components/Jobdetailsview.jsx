import Link from "next/link";
import {
  MapPin,
  Clock,
  Person,
  CircleDollar,
  Bookmark,
  CircleCheck,
  Heart,
  Display,
  Suitcase,
  ChartBar,
  Geo,
  Tag,
} from "@gravity-ui/icons";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const statTheme = {
  salary:   { icon: "#4ade80", label: "#4ade80", bg: "rgba(74,222,128,0.07)",  border: "rgba(74,222,128,0.20)"  },
  location: { icon: "#60a5fa", label: "#60a5fa", bg: "rgba(96,165,250,0.07)",  border: "rgba(96,165,250,0.20)"  },
  jobtype:  { icon: "#f87171", label: "#f87171", bg: "rgba(248,113,113,0.07)", border: "rgba(248,113,113,0.20)" },
  category: { icon: "#c084fc", label: "#c084fc", bg: "rgba(192,132,252,0.07)", border: "rgba(192,132,252,0.20)" },
};

const StatCard = ({ icon: Icon, label, value, theme }) => {
  const t = statTheme[theme] ?? statTheme.salary;
  return (
    <div className="jd-stat-card" style={{ background: t.bg, borderColor: t.border }}>
      <div className="jd-stat-icon" style={{ color: t.icon }}>
        <Icon width={14} height={14} />
      </div>
      <span className="jd-stat-label" style={{ color: t.label }}>{label}</span>
      <span className="jd-stat-value">{value}</span>
    </div>
  );
};

// ─── Benefit Item ─────────────────────────────────────────────────────────────
const BenefitItem = ({ icon: Icon, label }) => (
  <div className="jd-benefit-item">
    <div className="jd-benefit-icon"><Icon width={16} height={16} /></div>
    <span>{label}</span>
  </div>
);

// ─── Skill Tag ────────────────────────────────────────────────────────────────
const SkillTag = ({ label }) => <span className="jd-skill-tag">{label}</span>;

// ─── Main Component ───────────────────────────────────────────────────────────
const JobDetailsView = ({ job }) => {
  if (!job) return <div style={{ padding: "2rem", color: "#888" }}>Job not found.</div>;

  const {
    job_title, job_category, job_type,
    companyName, companyLogo,
    location, min_salary, max_salary, currency,
    deadline, requirements, responsibilities, benefits,
    createAt, _id,
  } = job;

  // Salary
  const currSymbol = currency === "USD" ? "$" : currency === "BDT" ? "৳" : (currency ?? "$");
  const fmt = (val) => {
    const n = parseInt(val, 10);
    if (!n) return null;
    return n >= 1000 ? `${currSymbol}${(n / 1000).toFixed(0)}k` : `${currSymbol}${n}`;
  };
  const salaryDisplay =
    min_salary && max_salary ? `${fmt(min_salary)} – ${fmt(max_salary)}`
    : min_salary ? `From ${fmt(min_salary)}`
    : max_salary ? `Up to ${fmt(max_salary)}`
    : null;

  // Parse text
  const parseField = (str) =>
    str ? str.split(/(?<=\.)\s+/).map((s) => s.trim().replace(/\.$/, "").trim()).filter((s) => s.length > 2) : [];

  const responsibilityItems = parseField(responsibilities);
  const requirementItems    = parseField(requirements);

  // Benefits
  const benefitsList = benefits
    ? benefits.split(/\.\s+|\.\s*$|,\s+/).map((b) => b.trim().replace(/\.$/, "").trim()).filter((b) => b.length > 4)
    : [];

  const benefitIconMap = [
    [/(health|medical|dental|vision)/i,              Heart],
    [/(stock|rsu|equity|share)/i,                    ChartBar],
    [/(hardware|equipment|device|laptop|stipend)/i,  Display],
    [/(pto|vacation|leave|time.?off)/i,              Suitcase],
    [/(remote|work.?from)/i,                         Geo],
    [/(401k|retirement|pension)/i,                   CircleDollar],
    [/(uber|credit|cash|membership|subscription)/i,  Tag],
  ];
  const getBenefitIcon = (text) => {
    for (const [re, Icon] of benefitIconMap) if (re.test(text)) return Icon;
    return CircleCheck;
  };

  const formatJobType  = (t) => t ? t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : null;
  const formatCategory = (c) => c ? c.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : null;
  const formatDate     = (d) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return d; }
  };

  const skillTags = requirementItems.slice(0, 6)
    .map((item) => item.split(/[,(]/)[0].trim())
    .filter((t) => t.length < 40);

  return (
    <>
      <style>{`
        .jd-wrap *, .jd-wrap *::before, .jd-wrap *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }
        .jd-wrap {
          padding: 24px 16px;
          color: #e8e8e8;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
        }
        .jd-inner {
          max-width: 980px;
          margin: 0 auto;
          display: flex; flex-direction: column; gap: 12px;
        }

        /* ── HEADER ── */
        .jd-header {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 14px;
          padding: 22px 24px;
          display: flex; align-items: flex-start; gap: 16px;
        }
        .jd-logo-box {
          width: 60px; height: 60px; flex-shrink: 0;
          border-radius: 12px; background: #fff;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; border: 1px solid #eee; padding: 5px;
        }
        .jd-logo-box img { width: 100%; height: 100%; object-fit: contain; }
        .jd-logo-fallback {
          font-size: 22px; font-weight: 800; color: #555;
          text-transform: uppercase; background: #222;
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center; border-radius: 8px;
        }
        .jd-header-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
        .jd-header-top  { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .jd-header-text { flex: 1; min-width: 0; }
        .jd-header-text h1 {
          font-size: clamp(16px, 3vw, 24px);
          font-weight: 700; color: #fff; line-height: 1.25; margin-bottom: 5px;
        }
        .jd-company-row {
          display: flex; align-items: center; gap: 7px;
          color: #888; font-size: 13px; flex-wrap: wrap;
        }
        .jd-header-actions {
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .jd-btn-bookmark {
          width: 38px; height: 38px; border-radius: 8px;
          border: 1px solid #333; background: transparent; color: #777;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color .15s, color .15s; flex-shrink: 0;
        }
        .jd-btn-bookmark:hover { border-color: #555; color: #ccc; }
        .jd-btn-apply {
          height: 38px; padding: 0 18px; border-radius: 8px;
          border: none; background: #fff; color: #111;
          font-size: 13px; font-weight: 600; cursor: pointer;
          text-decoration: none; display: inline-flex; align-items: center;
          transition: background .15s; white-space: nowrap; flex-shrink: 0;
        }
        .jd-btn-apply:hover { background: #e2e2e2; }

        /* ── STATS ── */
        .jd-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .jd-stat-card {
          border-radius: 12px; border: 1px solid;
          padding: 14px 16px;
          display: flex; flex-direction: column; gap: 4px;
          min-width: 0;
        }
        .jd-stat-icon  { margin-bottom: 2px; line-height: 1; }
        .jd-stat-label {
          font-size: 10px; letter-spacing: .08em;
          text-transform: uppercase; font-weight: 600; line-height: 1.2;
        }
        .jd-stat-value {
          font-size: 14px; font-weight: 700; color: #f0f0f0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* ── CONTENT ── */
        .jd-content {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 12px; align-items: start;
        }

        /* ── LEFT ── */
        .jd-left {
          background: #1a1a1a; border: 1px solid #2a2a2a;
          border-radius: 14px; padding: 26px 28px;
          display: flex; flex-direction: column; gap: 24px;
        }
        .jd-section-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 12px; }
        .jd-bullets { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .jd-bullets li {
          display: flex; align-items: flex-start; gap: 9px;
          font-size: 13.5px; line-height: 1.6; color: #999;
        }
        .jd-bullet-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #444; margin-top: 8px; flex-shrink: 0;
        }
        .jd-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 13px; }
        .jd-skill-tag {
          display: inline-flex; align-items: center;
          padding: 4px 10px;
          background: #222; border: 1px solid #333; border-radius: 20px;
          font-size: 11.5px; color: #bbb; white-space: nowrap;
        }
        .jd-benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
        .jd-benefit-item  { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #bbb; line-height: 1.4; }
        .jd-benefit-icon  {
          width: 34px; height: 34px; border-radius: 7px;
          background: #222; border: 1px solid #2e2e2e;
          display: flex; align-items: center; justify-content: center; color: #777; flex-shrink: 0;
        }
        .jd-divider { border: none; border-top: 1px solid #222; }

        /* ── RIGHT ── */
        .jd-right {
          background: #1a1a1a; border: 1px solid #2a2a2a;
          border-radius: 14px; padding: 20px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .jd-right-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 10px; }
        .jd-company-banner {
          width: 100%; aspect-ratio: 16/9; border-radius: 9px;
          background: #222; border: 1px solid #2e2e2e;
          overflow: hidden; display: flex; align-items: center; justify-content: center;
        }
        .jd-company-banner img { width: 48%; height: 48%; object-fit: contain; }
        .jd-company-banner-fallback { font-size: 30px; font-weight: 800; color: #333; text-transform: uppercase; }
        .jd-meta-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 0; border-bottom: 1px solid #1f1f1f; font-size: 13px;
        }
        .jd-meta-row:last-of-type { border-bottom: none; }
        .jd-meta-label { color: #555; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: .07em; }
        .jd-meta-value { color: #ccc; font-weight: 500; text-align: right; max-width: 58%; word-break: break-word; }
        .jd-deadline-row {
          display: flex; align-items: center; gap: 7px;
          font-size: 12.5px; color: #666;
          padding: 10px 12px; background: #161616;
          border-radius: 8px; border: 1px solid #222;
        }
        .jd-deadline-row strong { color: #f87171; }

        /* ══ RESPONSIVE ══════════════════════════════════════ */

        /* Tablet ≤ 860px */
        @media (max-width: 860px) {
          .jd-stats   { grid-template-columns: repeat(2, 1fr); }
          .jd-content { grid-template-columns: 1fr; }
          .jd-right   { order: -1; }
          .jd-company-banner { aspect-ratio: 3/1; }
          .jd-company-banner img { width: 22%; height: 80%; }
        }

        /* Mobile ≤ 600px */
        @media (max-width: 600px) {
          .jd-wrap  { padding: 14px 12px; }
          .jd-inner { gap: 10px; }
          .jd-header { padding: 16px 16px; gap: 12px; }
          .jd-logo-box { width: 50px; height: 50px; }
          .jd-header-text h1 { font-size: 17px; }
          .jd-header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .jd-header-actions {
            width: 100%;
          }
          .jd-btn-apply {
            flex: 1;
            justify-content: center;
            height: 36px;
            font-size: 12.5px;
          }
          .jd-btn-bookmark { width: 36px; height: 36px; }
          .jd-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .jd-stat-card { padding: 12px 13px; }
          .jd-stat-value { font-size: 13px; }
          .jd-left  { padding: 18px 16px; gap: 18px; }
          .jd-right { padding: 16px; }
          .jd-benefits-grid { grid-template-columns: 1fr; }
        }

        /* Mobile S ≤ 380px */
        @media (max-width: 380px) {
          .jd-stats { grid-template-columns: 1fr 1fr; gap: 6px; }
          .jd-stat-card { padding: 10px 11px; }
          .jd-stat-label { font-size: 9px; }
          .jd-stat-value { font-size: 12px; }
          .jd-header-text h1 { font-size: 15px; }
        }
      `}</style>

      <div className="jd-wrap">
        <div className="jd-inner">

          {/* ── Header ── */}
          <div className="jd-header">
            <div className="jd-logo-box">
              {companyLogo
                ? <img src={companyLogo} alt={companyName} />
                : <div className="jd-logo-fallback">{companyName?.charAt(0) ?? "?"}</div>
              }
            </div>

            <div className="jd-header-body">
              <div className="jd-header-top">
                <div className="jd-header-text">
                  <h1>{job_title}</h1>
                  <div className="jd-company-row">
                    <span>{companyName}</span>
                  </div>
                </div>
                <div className="jd-header-actions">
                  <button className="jd-btn-bookmark" aria-label="Save job">
                    <Bookmark width={16} height={16} />
                  </button>
                  <Link className="jd-btn-apply" href={`/jobs/${_id}/apply`}>
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="jd-stats">
            {salaryDisplay && (
              <StatCard icon={CircleDollar} label="Salary Range" value={salaryDisplay} theme="salary" />
            )}
            {location && (
              <StatCard icon={MapPin} label="Location" value={location} theme="location" />
            )}
            {job_type && (
              <StatCard icon={Clock} label="Job Type" value={formatJobType(job_type)} theme="jobtype" />
            )}
            {job_category && (
              <StatCard icon={Person} label="Category" value={formatCategory(job_category)} theme="category" />
            )}
          </div>

          {/* ── Content ── */}
          <div className="jd-content">

            {/* Left */}
            <div className="jd-left">
              {responsibilityItems.length > 0 && (
                <div>
                  <p className="jd-section-title">Responsibilities</p>
                  <ul className="jd-bullets">
                    {responsibilityItems.map((item, i) => (
                      <li key={i}><span className="jd-bullet-dot" /><span>{item}.</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {responsibilityItems.length > 0 && requirementItems.length > 0 && <hr className="jd-divider" />}
              {requirementItems.length > 0 && (
                <div>
                  <p className="jd-section-title">Requirements</p>
                  {skillTags.length > 0 && (
                    <div className="jd-tags">
                      {skillTags.map((tag, i) => <SkillTag key={i} label={tag} />)}
                    </div>
                  )}
                  <ul className="jd-bullets">
                    {requirementItems.map((item, i) => (
                      <li key={i}><span className="jd-bullet-dot" /><span>{item}.</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {benefitsList.length > 0 && (
                <>
                  <hr className="jd-divider" />
                  <div>
                    <p className="jd-section-title">Benefits</p>
                    <div className="jd-benefits-grid">
                      {benefitsList.map((b, i) => (
                        <BenefitItem key={i} icon={getBenefitIcon(b)} label={b} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right */}
            <div className="jd-right">
              <div>
                <p className="jd-right-title">Company Overview</p>
                <div className="jd-company-banner">
                  {companyLogo
                    ? <img src={companyLogo} alt={companyName} />
                    : <span className="jd-company-banner-fallback">{companyName?.charAt(0) ?? "?"}</span>
                  }
                </div>
              </div>
              <div>
                {companyName && (
                  <div className="jd-meta-row">
                    <span className="jd-meta-label">Company</span>
                    <span className="jd-meta-value">{companyName}</span>
                  </div>
                )}
                {job_category && (
                  <div className="jd-meta-row">
                    <span className="jd-meta-label">Field</span>
                    <span className="jd-meta-value">{formatCategory(job_category)}</span>
                  </div>
                )}
                {location && (
                  <div className="jd-meta-row">
                    <span className="jd-meta-label">Location</span>
                    <span className="jd-meta-value">{location}</span>
                  </div>
                )}
                {createAt && (
                  <div className="jd-meta-row">
                    <span className="jd-meta-label">Posted</span>
                    <span className="jd-meta-value">{formatDate(createAt)}</span>
                  </div>
                )}
              </div>
              {deadline && (
                <div className="jd-deadline-row">
                  <Clock width={13} height={13} />
                  <span>Apply before <strong>{formatDate(deadline)}</strong></span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetailsView;