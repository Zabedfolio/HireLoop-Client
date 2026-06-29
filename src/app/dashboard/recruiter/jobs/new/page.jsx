import React from 'react';
import Link from 'next/link';
import { requireRole } from '@/lib/core/session.js';
import { getLoggedInRecruiterCompany } from '@/lib/api/companies.js';
import { getPlanById } from '@/lib/api/plans.js';
import { getRecruiterStats } from '@/lib/api/stats.js';
import NewJob from '@/app/dashboard/recruiter/jobs/new/NewJob';
import { ShieldExclamation, CreditCard } from '@gravity-ui/icons';

const T = {
    bg1: '#0D0D0E',
    border: 'rgba(255,255,255,0.07)',
    text1: '#f4f4f5',
    text2: '#a1a1aa',
    text3: '#52525b',
    blue: '#60a5fa',
    red: '#f87171',
    amber: '#fbbf24',
};

const PostJobPage = async () => {
    const user = await requireRole('recruiter');
    const company = await getLoggedInRecruiterCompany();
    
    // Fetch recruiter plan details & active job count
    const plan = await getPlanById(user.plan || 'recruiter_free');
    const stats = await getRecruiterStats(user.id);
    const activeJobsCount = stats?.activeJobs || 0;
    const limit = plan?.maxActiveJobs || 1;

    const isBlocked = activeJobsCount >= limit;

    if (isBlocked) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: T.text1, textAlign: 'center', padding: 24 }}>
                <div style={{ borderRadius: 24, border: `1px solid ${T.border}`, background: T.bg1, padding: '36px 28px', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.red }}>
                        <ShieldExclamation width={24} height={24} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Active Job Limit Reached</h2>
                        <p style={{ margin: '8px 0 0', fontSize: 13, color: T.text2, lineHeight: 1.5 }}>
                            Your current <strong>{plan?.name || 'Free'}</strong> plan supports up to <strong>{limit}</strong> active job postings. You currently have <strong>{activeJobsCount}</strong> active listings.
                        </p>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: T.border }} />

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                        <Link
                            href="/dashboard/recruiter/jobs"
                            style={{
                                padding: '8px 16px', borderRadius: 10, border: `1px solid ${T.border}`,
                                background: 'transparent', color: T.text2, fontSize: 12, fontWeight: 600, textDecoration: 'none'
                            }}
                        >
                            Manage Open Jobs
                        </Link>
                        <Link
                            href="/pricing"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10,
                                border: 'none', background: T.text1, color: '#000', fontSize: 12, fontWeight: 600, textDecoration: 'none'
                            }}
                        >
                            Upgrade Plan
                            <CreditCard width={13} height={13} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NewJob company={company} />
        </div>
    );
};

export default PostJobPage;