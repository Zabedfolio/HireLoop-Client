'use client';

import { T } from '@/lib/actions/Tokens';
import React from 'react';

const NoCompanyState = ({ onRegister }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '80px 24px',
    textAlign: 'center',
  }}>
    {/* Illustration */}
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

      {/* Badge */}
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

export default NoCompanyState;