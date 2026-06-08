'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { T } from '@/lib/actions/Tokens';
import { XIcon, MapPinIcon, UploadIcon } from '@/components/dashboard/recruiter/Icons';
import { createCompany } from '@/lib/actions/companies.js';
import toast from 'react-hot-toast';

const RegisterModal = ({ onClose, onSubmit, initialData = null }) => {
  const [logoPreview, setLogoPreview] = useState(initialData?.logo || initialData?.logoPreview || null);
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

  const uploadLogoToImageBB = async (file) => {
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Logo upload failed.');
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error('Logo upload failed.');
    }

    return data.data.url;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    delete data.company_logo;

    let logoUrl = initialData?.logo || logoPreview || null;

    try {
      if (logoFile) {
        logoUrl = await uploadLogoToImageBB(logoFile);
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      setIsLoading(false);
      return;
    }

    await new Promise(r => setTimeout(r, 900));

    const payload = {
      ...data,
      logo: logoUrl,
      status: initialData?.status || 'pending',
    };

    try {
      const result = await createCompany(payload);
      onSubmit(result);
      if (result.insertedId) {
        toast.success('Company registered successfully!');
      }
    } catch (error) {
      console.error('Company creation error:', error);
    }

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

  const selectStyle = {
    ...inputStyle,
    paddingRight: 36,
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 13px center',
    cursor: 'pointer',
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
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes spin    { to { transform: rotate(360deg) } }
        .modal-input:focus { border-color: rgba(255,255,255,0.22) !important; background: rgba(255,255,255,0.05) !important; }
        .modal-input::placeholder { color: #52525b; }
        .modal-select option { color: #f4f4f5; }
        @media (max-width: 600px) { .modal-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 660, maxHeight: '92vh',
        overflowY: 'auto', borderRadius: 18,
        border: `1px solid ${T.border}`,
        boxShadow: '0 32px 72px rgba(0,0,0,0.7)',
        animation: 'slideUp 0.22s ease',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.08) transparent',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '22px 24px 20px',
          borderBottom: `1px solid ${T.border}`,
          position: 'sticky', top: 0, zIndex: 10,
          borderRadius: '18px 18px 0 0',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: T.text1, letterSpacing: '-0.01em' }}>
              {initialData ? 'Edit Company Details' : 'Register New Company'}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: T.text3 }}>
              {initialData ? 'Update your business profile and logo.' : 'Enter your business details to start hiring on HireLoop.'}
            </p>
          </div>
          <button
            type="button" onClick={onClose}
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

            {/* Company Name + Industry */}
            <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Company Name</label>
                <input name="company_name" required placeholder="e.g. Acme Corp" className="modal-input" style={inputStyle} defaultValue={initialData?.company_name || ''} />
              </div>
              <div>
                <label style={labelStyle}>Industry / Category</label>
                <select name="industry" required className="modal-input" style={selectStyle} defaultValue={initialData?.industry || ''}>
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

            {/* Website + Location */}
            <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Website URL</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    position: 'absolute', left: 0, height: '100%',
                    display: 'flex', alignItems: 'center', padding: '0 12px',
                    borderRight: `1px solid ${T.border}`, color: T.text3, fontSize: 12,
                    borderRadius: '10px 0 0 10px', background: 'rgba(255,255,255,0.02)',
                    pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none',
                  }}>
                    https://
                  </span>
                  <input name="website_url" placeholder="www.company.com" className="modal-input" style={{ ...inputStyle, paddingLeft: 88 }} defaultValue={initialData?.website_url || ''} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: T.text3, pointerEvents: 'none' }}>
                    <MapPinIcon />
                  </span>
                  <input name="location" required placeholder="City, Country" className="modal-input" style={{ ...inputStyle, paddingLeft: 36 }} defaultValue={initialData?.location || ''} />
                </div>
              </div>
            </div>

            {/* Employee Count + Logo */}
            <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
              <div>
                <label style={labelStyle}>Employee Count Range</label>
                <select name="employee_count" required className="modal-input" style={selectStyle} defaultValue={initialData?.employee_count || ''}>
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
                      width: 58, height: 58, flexShrink: 0, borderRadius: 12,
                      border: `1.5px dashed ${dragOver ? 'rgba(255,255,255,0.3)' : T.border}`,
                      background: dragOver ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                    onMouseEnter={e => { if (!logoPreview) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                    onMouseLeave={e => { if (!logoPreview) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; } }}
                  >
                    {logoPreview
                      ? <Image src={logoPreview} alt="Logo preview" fill style={{ objectFit: 'cover' }} />
                      : <span style={{ color: T.text3 }}><UploadIcon /></span>
                    }
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, color: T.text2, fontWeight: 500 }}>
                      {logoPreview ? 'Logo selected' : 'Upload image'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: T.text3 }}>PNG, JPG up to 5MB</p>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                        style={{ marginTop: 4, fontSize: 10, color: T.red, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" name="company_logo" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display: 'none' }} onChange={(e) => handleLogoChange(e.target.files[0])} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Brief Description</label>
              <textarea
                name="description" required
                placeholder="Tell us about your company's mission and culture..."
                className="modal-input"
                style={{ ...inputStyle, minHeight: 100, resize: 'none', lineHeight: 1.6 }}
                defaultValue={initialData?.description || ''}
              />
            </div>

          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            padding: '14px 24px',
            borderTop: `1px solid ${T.border}`,
            position: 'sticky', bottom: 0,
            borderRadius: '0 0 18px 18px',
          }}>
            <button
              type="button" onClick={onClose}
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
              type="submit" disabled={isLoading}
              style={{
                padding: '9px 20px', borderRadius: 10, border: 'none',
                background: isLoading ? 'rgba(244,244,245,0.7)' : T.text1,
                color: '#000', fontSize: 13, fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'opacity 0.1s',
                display: 'flex', alignItems: 'center', gap: 7,
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {isLoading && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: 'spin 0.7s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                </svg>
              )}
              {isLoading ? (initialData ? 'Saving…' : 'Registering…') : (initialData ? 'Save Changes' : 'Register Company')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;