'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { Gear, Person, ShieldKeyhole, FileText } from '@gravity-ui/icons';

const UploadIcon = () => (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 12m4-4v12" />
    </svg>
);

const T = {
    bg0: '#080809',
    bg1: '#0D0D0E',
    bg2: '#111113',
    border: 'rgba(255,255,255,0.07)',
    text1: '#f4f4f5',
    text2: '#a1a1aa',
    text3: '#52525b',
    blue: '#60a5fa',
    green: '#34d399',
    red: '#f87171',
};

export default function SeekerSettingsClient({ user }) {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.image || '');
    const [headline, setHeadline] = useState(user?.headline || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [skills, setSkills] = useState(user?.skills || '');
    const [resumeUrl, setResumeUrl] = useState(user?.resume || '');

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);

        try {
            const { data, error } = await authClient.updateUser({
                name,
                image: avatarUrl,
                headline,
                bio,
                skills,
                resume: resumeUrl,
            });

            if (error) {
                toast.error(error.message || 'Failed to update profile settings.');
            } else {
                toast.success('Profile settings updated successfully!');
            }
        } catch (err) {
            console.error('Profile settings save error:', err);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long.');
            return;
        }

        setIsSavingPassword(true);
        try {
            const { error } = await authClient.changePassword({
                newPassword,
                currentPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                toast.error(error.message || 'Failed to update password.');
            } else {
                toast.success('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            console.error('Password change error:', err);
            toast.error('Failed to change password.');
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            const result = await res.json();
            if (result.success) {
                setAvatarUrl(result.data.url);
                toast.success('Avatar uploaded successfully!');
            } else {
                toast.error('Failed to upload image.');
            }
        } catch (err) {
            console.error('Avatar upload error:', err);
            toast.error('Image upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10,
        background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`,
        color: T.text1, fontSize: 13, outline: 'none', transition: 'border-color 0.15s, background 0.15s'
    };

    const labelStyle = {
        display: 'block', fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6,
        letterSpacing: '0.01em'
    };

    return (
        <div style={{ minHeight: '100vh', background: T.bg0, color: T.text1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 28 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>Seeker</p>
                <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>Settings</h1>
                <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Manage your profile credentials and application resume.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="md:grid-cols-[2fr_1fr]">
                
                {/* Profile form card */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <Person width={18} height={18} style={{ color: T.blue }} />
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Personal Information</h2>
                    </div>

                    <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        
                        {/* Avatar upload */}
                        <div>
                            <label style={labelStyle}>Profile Photo</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 64, height: 64, borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ margin: 'auto', color: T.text3, fontSize: 12 }}>None</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 8,
                                            border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)',
                                            padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer',
                                            color: T.text2
                                        }}
                                    >
                                        <UploadIcon />
                                        {isUploading ? 'Uploading...' : 'Upload Image'}
                                        <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} style={{ display: 'none' }} />
                                    </label>
                                    <span style={{ fontSize: 11, color: T.text3 }}>PNG or JPG. Max 5MB.</span>
                                </div>
                            </div>
                        </div>

                        {/* Name + Email */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="sm:grid-cols-2">
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email Address (Read-only)</label>
                                <input type="email" value={email} readOnly style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
                            </div>
                        </div>

                        {/* Headline */}
                        <div>
                            <label style={labelStyle}>Headline</label>
                            <input type="text" placeholder="e.g. Senior Frontend Developer | React | Next.js" value={headline} onChange={e => setHeadline(e.target.value)} style={inputStyle} />
                        </div>

                        {/* Bio */}
                        <div>
                            <label style={labelStyle}>Bio / Summary</label>
                            <textarea rows={4} placeholder="Describe your background and expertise..." value={bio} onChange={e => setBio(e.target.value)} style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />
                        </div>

                        {/* Skills */}
                        <div>
                            <label style={labelStyle}>Skills (Comma separated)</label>
                            <input type="text" placeholder="e.g. React, Next.js, Node.js, TailwindCSS" value={skills} onChange={e => setSkills(e.target.value)} style={inputStyle} />
                        </div>

                        {/* Resume PDF URL */}
                        <div>
                            <label style={labelStyle}>Resume URL (Hosted PDF Link)</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.text3 }}><FileText width={14} height={14} /></span>
                                <input type="text" placeholder="https://drive.google.com/.../my_resume.pdf" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} style={{ ...inputStyle, paddingLeft: 34 }} />
                            </div>
                            <span style={{ fontSize: 11, color: T.text3, marginTop: 4, display: 'block' }}>Provide a shared link to your resume PDF (e.g. Google Drive, Dropbox).</span>
                        </div>

                        <div style={{ paddingTop: 10 }}>
                            <button
                                type="submit"
                                disabled={isSavingProfile}
                                style={{
                                    padding: '9px 20px', borderRadius: 10, border: 'none',
                                    background: T.text1, color: '#000', fontSize: 13, fontWeight: 600,
                                    cursor: isSavingProfile ? 'not-allowed' : 'pointer', opacity: isSavingProfile ? 0.7 : 1
                                }}
                            >
                                {isSavingProfile ? 'Saving Settings...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password card */}
                <div style={{ borderRadius: 16, border: `1px solid ${T.border}`, background: T.bg1, padding: 24, height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <ShieldKeyhole width={18} height={18} style={{ color: T.blue }} />
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Security Settings</h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Current Password</label>
                            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>New Password</label>
                            <input type="password" placeholder="Min. 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Confirm New Password</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={inputStyle} />
                        </div>

                        <div style={{ paddingTop: 6 }}>
                            <button
                                type="submit"
                                disabled={isSavingPassword}
                                style={{
                                    width: '100%', padding: '9px 18px', borderRadius: 10, border: `1px solid ${T.border}`,
                                    background: 'transparent', color: T.text2, fontSize: 12, fontWeight: 600,
                                    cursor: isSavingPassword ? 'not-allowed' : 'pointer', transition: 'color 0.15s, border-color 0.15s'
                                }}
                                onMouseEnter={e => { if (!isSavingPassword) { e.currentTarget.style.color = T.text1; e.currentTarget.style.borderColor = T.blue; } }}
                                onMouseLeave={e => { if (!isSavingPassword) { e.currentTarget.style.color = T.text2; e.currentTarget.style.borderColor = T.border; } }}
                            >
                                {isSavingPassword ? 'Updating Password...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {/* Responsive grid styles wrapper */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .md-grid-cols-\\[2fr_1fr\\] {
                        grid-template-columns: 1fr !important;
                    }
                    .sm-grid-cols-2 {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

        </div>
    );
}
