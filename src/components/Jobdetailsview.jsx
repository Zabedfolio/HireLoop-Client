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
  Calendar,
  Tag,
} from "@gravity-ui/icons";

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="jd-stat-card">
    <div className="jd-stat-icon">
      <Icon width={16} height={16} />
    </div>
    <span className="jd-stat-label">{label}</span>
    <span className="jd-stat-value">{value}</span>
  </div>
);

// ─── Benefit Item ─────────────────────────────────────────────────────────────
const BenefitItem = ({ icon: Icon, label }) => (
  <div className="jd-benefit-item">
    <div className="jd-benefit-icon">
      <Icon width={18} height={18} />
    </div>
    <span>{label}</span>
  </div>
);

// ─── Skill Tag ────────────────────────────────────────────────────────────────
const SkillTag = ({ label }) => (
  <span className="jd-skill-tag">{label}</span>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const JobDetailsView = ({ job }) => {
  if (!job) {
    return <div style={{ padding: "2rem", color: "#888" }}>Job not found.</div>;
  }

  const {
    job_title,
    job_category,
    job_type,
    companyName,
    companyLogo,
    location,
    min_salary,
    max_salary,
    currency,
    deadline,
    requirements,
    responsibilities,
    benefits,
    createAt,
    _id,
  } = job;

  // ── Salary ────────────────────────────────────────────────────────────────
  const currSymbol = currency === "USD" ? "$" : currency === "BDT" ? "৳" : (currency ?? "$");
  const fmt = (val) => {
    const n = parseInt(val, 10);
    if (!n) return null;
    return n >= 1000 ? `${currSymbol}${(n / 1000).toFixed(0)}k` : `${currSymbol}${n}`;
  };
  const salaryDisplay =
    min_salary && max_salary
      ? `${fmt(min_salary)} – ${fmt(max_salary)}`
      : min_salary
      ? `From ${fmt(min_salary)}`
      : max_salary
      ? `Up to ${fmt(max_salary)}`
      : null;

  // ── Parse text fields into bullet arrays ─────────────────────────────────
  const parseField = (str) =>
    str
      ? str
          .split(/(?<=\.)\s+/)
          .map((s) => s.trim().replace(/\.$/, "").trim())
          .filter((s) => s.length > 2)
      : [];

  const responsibilityItems = parseField(responsibilities);
  const requirementItems = parseField(requirements);

  // ── Benefits ─────────────────────────────────────────────────────────────
  const benefitsList = benefits
    ? benefits
        .split(/\.\s+|\.\s*$|,\s+/)
        .map((b) => b.trim().replace(/\.$/, "").trim())
        .filter((b) => b.length > 4)
    : [];

  const benefitIconMap = [
    [/(health|medical|dental|vision)/i, Heart],
    [/(stock|rsu|equity|share)/i, ChartBar],
    [/(hardware|equipment|device|laptop|stipend)/i, Display],
    [/(pto|vacation|leave|time.?off)/i, Suitcase],
    [/(remote|work.?from)/i, Geo],
    [/(401k|retirement|pension)/i, CircleDollar],
    [/(uber|credit|cash|membership|subscription)/i, Tag],
  ];

  const getBenefitIcon = (text) => {
    for (const [re, Icon] of benefitIconMap) {
      if (re.test(text)) return Icon;
    }
    return CircleCheck;
  };

  // ── Formatters ────────────────────────────────────────────────────────────
  const formatJobType = (t) =>
    t ? t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : null;

  const formatDate = (d) => {
    if (!d) return null;
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  const formatCategory = (c) =>
    c ? c.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase()) : null;

  // ── Skill tags from requirements (first fragment of each sentence) ────────
  const skillTags = requirementItems
    .slice(0, 6)
    .map((item) => item.split(/[,(]/)[0].trim())
    .filter((t) => t.length < 40);

  return (
    <>
      <style>{`
        .jd-wrap *, .jd-wrap *::before, .jd-wrap *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .jd-wrap {
          padding: 32px 24px;
          color: #e8e8e8;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
        }

        .jd-inner {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Header ── */
        .jd-header {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 14px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .jd-logo-box {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid #333;
          padding: 6px;
        }

        .jd-logo-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .jd-logo-fallback {
          font-size: 24px;
          font-weight: 800;
          color: #444;
          text-transform: uppercase;
          background: #222;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .jd-header-text { flex: 1; min-width: 0; }

        .jd-header-text h1 {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .jd-company-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 14px;
          flex-wrap: wrap;
        }

        .jd-verified {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #4ade80;
          font-size: 13px;
          font-weight: 500;
        }

        .jd-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .jd-btn-bookmark {
          width: 44px;
          height: 44px;
          border-radius: 9px;
          border: 1px solid #333;
          background: transparent;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .jd-btn-bookmark:hover { border-color: #555; color: #ccc; }

        .jd-btn-apply {
          height: 44px;
          padding: 0 24px;
          border-radius: 9px;
          border: none;
          background: #ffffff;
          color: #111111;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .jd-btn-apply:hover { background: #e0e0e0; }

        /* ── Stats Row ── */
        .jd-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .jd-stat-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .jd-stat-icon { color: #555; margin-bottom: 2px; }

        .jd-stat-label {
          font-size: 10px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #555;
          font-weight: 600;
        }

        .jd-stat-value {
          font-size: 15px;
          font-weight: 600;
          color: #e0e0e0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── 3-stat variant (no experience) ── */
        .jd-stats-3 { grid-template-columns: repeat(3, 1fr); }

        /* ── Content ── */
        .jd-content {
          display: grid;
          grid-template-columns: 1fr 272px;
          gap: 16px;
          align-items: start;
        }

        /* ── Left ── */
        .jd-left {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 14px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .jd-section-title {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 14px;
        }

        .jd-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .jd-bullets li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          line-height: 1.65;
          color: #999;
        }

        .jd-bullet-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #444;
          margin-top: 9px;
          flex-shrink: 0;
        }

        /* ── Skill Tags ── */
        .jd-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .jd-skill-tag {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          background: #222;
          border: 1px solid #333;
          border-radius: 6px;
          font-size: 12px;
          color: #bbb;
          white-space: nowrap;
        }

        /* ── Benefits ── */
        .jd-benefits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .jd-benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #bbb;
          line-height: 1.4;
        }

        .jd-benefit-icon {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: #222;
          border: 1px solid #2e2e2e;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777;
          flex-shrink: 0;
        }

        .jd-divider {
          border: none;
          border-top: 1px solid #222;
        }

        /* ── Right ── */
        .jd-right {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 14px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .jd-right-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .jd-company-banner {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 10px;
          background: #222;
          border: 1px solid #2e2e2e;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .jd-company-banner img {
          width: 55%;
          height: 55%;
          object-fit: contain;
        }

        .jd-company-banner-fallback {
          font-size: 36px;
          font-weight: 800;
          color: #333;
          text-transform: uppercase;
        }

        .jd-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #222;
          font-size: 13px;
        }

        .jd-meta-row:last-of-type { border-bottom: none; }

        .jd-meta-label {
          color: #555;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .jd-meta-value {
          color: #ccc;
          font-weight: 500;
          text-align: right;
        }

        .jd-deadline-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #666;
          padding: 11px 14px;
          background: #161616;
          border-radius: 8px;
          border: 1px solid #222;
        }

        .jd-deadline-row strong { color: #aaa; }

        /* ── Responsive ── */
        @media (max-width: 820px) {
          .jd-stats { grid-template-columns: 1fr 1fr; }
          .jd-stats-3 { grid-template-columns: 1fr 1fr; }
          .jd-content { grid-template-columns: 1fr; }
          .jd-benefits-grid { grid-template-columns: 1fr; }
          .jd-header { flex-wrap: wrap; }
        }
      `}</style>

      <div className="jd-wrap">
        <div className="jd-inner">

          {/* ── Header ── */}
          <div className="jd-header">
            <div className="jd-logo-box">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} />
              ) : (
                <div className="jd-logo-fallback">
                  {companyName?.charAt(0) ?? "?"}
                </div>
              )}
            </div>

            <div className="jd-header-text">
              <h1>{job_title}</h1>
              <div className="jd-company-row">
                <span>{companyName}</span>
                <span>·</span>
                <span className="jd-verified">
                  <CircleCheck width={13} height={13} />
                  Verified Employer
                </span>
              </div>
            </div>

            <div className="jd-header-actions">
              <button className="jd-btn-bookmark" aria-label="Save job">
                <Bookmark width={18} height={18} />
              </button>
              <Link className="jd-btn-apply" href={`/jobs/${_id}/apply`}>
                Apply Now
              </Link>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className={`jd-stats${salaryDisplay ? "" : " jd-stats-3"}`}>
            {salaryDisplay && (
              <StatCard icon={CircleDollar} label="Salary Range" value={salaryDisplay} />
            )}
            {location && (
              <StatCard icon={MapPin} label="Location" value={location} />
            )}
            {job_type && (
              <StatCard icon={Clock} label="Job Type" value={formatJobType(job_type)} />
            )}
            {job_category && (
              <StatCard icon={Person} label="Category" value={formatCategory(job_category)} />
            )}
          </div>

          {/* ── Content ── */}
          <div className="jd-content">

            {/* Left panel */}
            <div className="jd-left">

              {/* Responsibilities */}
              {responsibilityItems.length > 0 && (
                <div>
                  <p className="jd-section-title">Responsibilities</p>
                  <ul className="jd-bullets">
                    {responsibilityItems.map((item, i) => (
                      <li key={i}>
                        <span className="jd-bullet-dot" />
                        <span>{item}.</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {responsibilityItems.length > 0 && requirementItems.length > 0 && (
                <hr className="jd-divider" />
              )}

              {/* Requirements */}
              {requirementItems.length > 0 && (
                <div>
                  <p className="jd-section-title">Requirements</p>
                  {skillTags.length > 0 && (
                    <div className="jd-tags">
                      {skillTags.map((tag, i) => (
                        <SkillTag key={i} label={tag} />
                      ))}
                    </div>
                  )}
                  <ul className="jd-bullets">
                    {requirementItems.map((item, i) => (
                      <li key={i}>
                        <span className="jd-bullet-dot" />
                        <span>{item}.</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
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

            {/* Right panel */}
            <div className="jd-right">
              <div>
                <p className="jd-right-title">Company Overview</p>
                <div className="jd-company-banner">
                  {companyLogo ? (
                    <img src={companyLogo} alt={companyName} />
                  ) : (
                    <span className="jd-company-banner-fallback">
                      {companyName?.charAt(0) ?? "?"}
                    </span>
                  )}
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
                  <Clock width={14} height={14} />
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