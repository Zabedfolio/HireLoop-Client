'use client';

import React, { useState, useRef } from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  border: 'rgba(255,255,255,0.07)',
  borderHover: 'rgba(255,255,255,0.14)',
  text1:  '#f4f4f5',
  text2:  '#a1a1aa',
  text3:  '#52525b',
  amber:  '#fbbf24',
  red:    '#f87171',
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const BuildingIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TagIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 9.828V5a2 2 0 012-2h2z" />
  </svg>
);

// ─── Register Company Modal ───────────────────────────────────────────────────
const RegisterModal = ({ onClose, onSubmit }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogoChange = (file) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleLogoChange(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    if (logoFile) formData.set('company_logo', logoFile);
    await new Promise(r => setTimeout(r, 900));
    const data = Object.fromEntries(formData.entries());
    onSubmit({ ...data, logoPreview });
    setIsLoading(false);
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 13px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${T.border}`,
    color: T.text1,
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, background 0.15s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: T.text2,
    marginBottom: 7,
    letterSpacing: '0.01em',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.18s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        .modal-input:focus { border-color: rgba(255,255,255,0.22) !important; background: rgba(255,255,255,0.05) !important; }
        .modal-input::placeholder { color: #52525b; }
        .modal-select option { color: #f4f4f5; }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: 660,
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 18,
          border: `1px solid ${T.border}`,
          /* no background — inherits from dark theme */
          boxShadow: '0 32px 72px rgba(0,0,0,0.7)',
          animation: 'slideUp 0.22s ease',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.08) transparent',
        }}
      >
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '22px 24px 20px',
          borderBottom: `1px solid ${T.border}`,
          position: 'sticky', top: 0,
          /* no background */
          zIndex: 10,
          borderRadius: '18px 18px 0 0',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: T.text1, letterSpacing: '-0.01em' }}>
              Register New Company
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: T.text3 }}>
              Enter your business details to start hiring on HireLoop.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: 'none', background: 'transparent',
              color: T.text3, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s, color 0.12s',
              flexShrink: 0, marginLeft: 12,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = T.text1; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.text3; }}
          >
            <XIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit}>
          <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Row 1: Company Name + Industry */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Company Name</label>
                <input
                  name="company_name"
                  required
                  placeholder="e.g. Acme Corp"
                  className="modal-input"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Industry / Category</label>
                <select
                  name="industry"
                  required
                  className="modal-input"
                  style={{
                    ...inputStyle,
                    paddingRight: 36,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 13px center',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="consulting">Consulting</option>
                  <option value="media">Media & Entertainment</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Row 2: Website URL + Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Website URL</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    position: 'absolute', left: 0,
                    height: '100%', display: 'flex', alignItems: 'center',
                    padding: '0 12px',
                    borderRight: `1px solid ${T.border}`,
                    color: T.text3, fontSize: 12,
                    borderRadius: '10px 0 0 10px',
                    background: 'rgba(255,255,255,0.02)',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}>
                    https://
                  </span>
                  <input
                    name="website_url"
                    placeholder="www.company.com"
                    className="modal-input"
                    style={{ ...inputStyle, paddingLeft: 88 }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 13, top: '50%',
                    transform: 'translateY(-50%)',
                    color: T.text3, pointerEvents: 'none',
                  }}>
                    <MapPinIcon />
                  </span>
                  <input
                    name="location"
                    required
                    placeholder="City, Country"
                    className="modal-input"
                    style={{ ...inputStyle, paddingLeft: 36 }}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Employee Count + Company Logo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
              <div>
                <label style={labelStyle}>Employee Count Range</label>
                <select
                  name="employee_count"
                  required
                  className="modal-input"
                  style={{
                    ...inputStyle,
                    paddingRight: 36,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 13px center',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select range</option>
                  <option value="1-10">1–10 employees</option>
                  <option value="11-50">11–50 employees</option>
                  <option value="51-200">51–200 employees</option>
                  <option value="201-500">201–500 employees</option>
                  <option value="501-1000">501–1,000 employees</option>
                  <option value="1001+">1,001+ employees</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Company Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{
                      width: 58, height: 58, flexShrink: 0,
                      borderRadius: 12,
                      border: `1.5px dashed ${dragOver ? 'rgba(255,255,255,0.3)' : T.border}`,
                      background: dragOver ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => { if (!logoPreview) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
                    onMouseLeave={e => { if (!logoPreview) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: T.text3 }}><UploadIcon /></span>
                    )}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, color: T.text2, fontWeight: 500 }}>
                      {logoPreview ? 'Logo selected' : 'Upload image'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>
                      PNG, JPG up to 5MB
                    </p>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                        style={{
                          marginTop: 4, fontSize: 10, color: T.red,
                          background: 'transparent', border: 'none',
                          cursor: 'pointer', padding: 0,
                          fontFamily: 'inherit',
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="company_logo"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    style={{ display: 'none' }}
                    onChange={(e) => handleLogoChange(e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            {/* Brief Description */}
            <div>
              <label style={labelStyle}>Brief Description</label>
              <textarea
                name="description"
                required
                placeholder="Tell us about your company's mission and culture..."
                className="modal-input"
                style={{
                  ...inputStyle,
                  minHeight: 100,
                  resize: 'none',
                  lineHeight: 1.6,
                }}
              />
            </div>

          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            padding: '14px 24px',
            borderTop: `1px solid ${T.border}`,
            position: 'sticky', bottom: 0,
            /* no background */
            borderRadius: '0 0 18px 18px',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px', borderRadius: 10,
                border: `1px solid ${T.border}`,
                background: 'transparent', color: T.text2,
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'color 0.1s, border-color 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text1; e.currentTarget.style.borderColor = T.borderHover; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.text2; e.currentTarget.style.borderColor = T.border; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '9px 20px', borderRadius: 10,
                border: 'none',
                background: isLoading ? 'rgba(244,244,245,0.7)' : T.text1,
                color: '#000',
                fontSize: 13, fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'opacity 0.1s, transform 0.1s',
                display: 'flex', alignItems: 'center', gap: 7,
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {isLoading && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                  style={{ animation: 'spin 0.7s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                </svg>
              )}
              {isLoading ? 'Registering…' : 'Register Company'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 600px) {
          .modal-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const NoCompanyState = ({ onRegister }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '80px 24px',
    textAlign: 'center',
  }}>
    <div style={{ position: 'relative', marginBottom: 32 }}>
      <div style={{
        width: 200, height: 160, borderRadius: 18,
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '20px 22px',
        gap: 8,
        transform: 'rotate(-2deg)',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.07)', width: '75%' }} />
        <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.04)', width: '55%' }} />
        <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.04)', width: '65%' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.06)', width: '30%' }} />
          <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.04)', width: '25%' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 14, right: 14, color: 'rgba(255,255,255,0.12)' }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <div style={{
        position: 'absolute', top: -12, right: -12,
        width: 44, height: 44, borderRadius: '50%',
        background: T.text1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
      }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    </div>

    <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em' }}>
      Company not registered yet
    </h2>
    <p style={{ margin: '0 0 32px', fontSize: 13, color: T.text3, maxWidth: 340, lineHeight: 1.7 }}>
      Set up your business profile to start posting high-performance job listings and manage your talent loop.
    </p>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
      <button
        onClick={onRegister}
        style={{
          padding: '11px 28px', borderRadius: 12,
          background: T.text1, border: 'none',
          color: '#000', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'opacity 0.1s, transform 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.96)'; }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Register your company
      </button>
      <button
        style={{
          padding: '11px 24px', borderRadius: 12,
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${T.border}`,
          color: T.text2, fontSize: 14, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background 0.1s, color 0.1s, border-color 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = T.text1; e.currentTarget.style.borderColor = T.borderHover; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = T.text2; e.currentTarget.style.borderColor = T.border; }}
      >
        View FAQ
      </button>
    </div>

    <p style={{ margin: '32px 0 0', fontSize: 12, color: T.text3 }}>
      Need specialized assistance?{' '}
      <a href="#" style={{ color: T.text2, textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
        Contact our enterprise support team.
      </a>
    </p>
  </div>
);

// ─── Pending Company Card ─────────────────────────────────────────────────────
const PendingCompanyCard = ({ company }) => {
  const metaItems = [
    company.industry       && { icon: <TagIcon />,    label: company.industry.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
    company.location       && { icon: <MapPinIcon />, label: company.location },
    company.website_url    && { icon: <GlobeIcon />,  label: company.website_url.replace(/^https?:\/\//, '') },
    company.employee_count && { icon: <UsersIcon />,  label: company.employee_count + ' employees' },
  ].filter(Boolean);

  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${T.border}`,
      /* no background */
      overflow: 'hidden',
    }}>
      {/* Pending notice bar */}
      <div style={{
        padding: '10px 20px',
        background: 'rgba(251,191,36,0.06)',
        borderBottom: `1px solid rgba(251,191,36,0.12)`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ color: T.amber, display: 'flex' }}><ClockIcon /></span>
        <p style={{ margin: 0, fontSize: 12, color: T.amber, fontWeight: 500 }}>
          Your company registration is pending admin approval. It won't appear publicly until approved.
        </p>
      </div>

      <div style={{ padding: '28px 28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
          {/* Logo */}
          <div style={{
            width: 64, height: 64, borderRadius: 14, flexShrink: 0,
            border: `1px solid ${T.border}`,
            background: 'rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {company.logoPreview ? (
              <img src={company.logoPreview} alt="Company logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: T.text3 }}><BuildingIcon /></span>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: T.text1, letterSpacing: '-0.01em' }}>
                {company.company_name}
              </h2>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                borderRadius: 9999, padding: '3px 10px',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
                background: 'rgba(251,191,36,0.08)',
                color: T.amber,
                boxShadow: '0 0 0 1px rgba(251,191,36,0.2)',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.amber, flexShrink: 0 }} />
                Pending
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 10 }}>
              {metaItems.map((item, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: T.text3 }}>
                  <span style={{ color: T.text3 }}>{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <div style={{
            marginTop: 20,
            padding: '14px 16px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${T.border}`,
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>About</p>
            <p style={{ margin: 0, fontSize: 13, color: T.text2, lineHeight: 1.65 }}>
              {company.description}
            </p>
          </div>
        )}

        {/* What's next */}
        <div style={{
          marginTop: 16,
          padding: '14px 16px',
          borderRadius: 10,
          background: 'rgba(255,255,255,0.015)',
          border: `1px solid ${T.border}`,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.text3 }}>What's next?</p>
          {[
            'An admin will review your company details within 1–2 business days.',
            'You will be notified once your company is approved.',
            'After approval, you can start posting job listings.',
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, marginTop: 5, width: 4, height: 4, borderRadius: '50%', background: T.text3 }} />
              <p style={{ margin: 0, fontSize: 12, color: T.text3, lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MyCompanyClient = () => {
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany]     = useState(null);

  const handleRegister = (data) => {
    setCompany({ ...data, status: 'pending' });
    setShowModal(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: T.text1,
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 16px' }}>
        {/* Page header */}
        <div style={{
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 22, marginBottom: 28,
        }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Recruiter</p>
          <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>
            My Company
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>
            Manage your business profile and hiring presence.
          </p>
        </div>

        {/* Main content */}
        {!company ? (
          <div style={{
            borderRadius: 16,
            border: `1px solid ${T.border}`,
            /* no background */
          }}>
            <NoCompanyState onRegister={() => setShowModal(true)} />
          </div>
        ) : (
          <PendingCompanyCard company={company} />
        )}
      </div>

      {showModal && (
        <RegisterModal
          onClose={() => setShowModal(false)}
          onSubmit={handleRegister}
        />
      )}
    </div>
  );
};

export default MyCompanyClient;