'use client';

import React from 'react';
import { ClockIcon, GlobeIcon, MapPinIcon, TagIcon, UsersIcon } from '@/components/dashboard/recruiter/Icons';
import { T } from '@/lib/actions/Tokens';

const PendingCompanyCard = ({ company }) => {
  const metaItems = [
    company.industry       && { icon: <TagIcon />,    label: company.industry.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
    company.location       && { icon: <MapPinIcon />, label: company.location },
    company.website_url    && { icon: <GlobeIcon />,  label: company.website_url.replace(/^https?:\/\//, '') },
    company.employee_count && { icon: <UsersIcon />,  label: company.employee_count + ' employees' },
  ].filter(Boolean);

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>

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
            {company.logoPreview
              ? <img src={company.logoPreview} alt="Company logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: T.text3 }}><BuildingIcon /></span>
            }
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
            marginTop: 20, padding: '14px 16px',
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
          marginTop: 16, padding: '14px 16px',
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

export default PendingCompanyCard;