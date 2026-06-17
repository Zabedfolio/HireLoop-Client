'use client';

import {
    BsArrowLeft,
    BsBriefcaseFill,
    BsCalendar,
    BsCheck,
    BsEnvelopeFill,
    BsLink45Deg,
    BsGeoAlt,
    BsPaperclip,
    BsPerson,
    BsPersonFill,
    BsTelephone,
    BsRocket,
    BsListUl,
    BsTextLeft,
    BsExclamationTriangle,
    BsX,
} from 'react-icons/bs';

import {
    Button,
    Card,
    Chip,
    FieldError,
    Input,
    Label,
    ListBox,
    ListBoxItem,
    Select,
    Separator,
    TextArea,
    TextField,
} from '@heroui/react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { submitApplication } from '@/lib/actions/applications';
import toast from 'react-hot-toast';
import ApplicationLimitCard from '@/components/Applicationlimitcard';

/* ─────────────────────────────────────────
   Static data
───────────────────────────────────────── */
const EXPERIENCE_LEVELS = [
    { id: 'entry', label: 'Entry Level (0–1 years)' },
    { id: 'junior', label: 'Junior (1–3 years)' },
    { id: 'mid', label: 'Mid Level (3–5 years)' },
    { id: 'senior', label: 'Senior (5–8 years)' },
    { id: 'lead', label: 'Lead / Principal (8+ years)' },
];

const NOTICE_PERIODS = [
    { id: 'immediately', label: 'Immediately' },
    { id: '2weeks', label: '2 Weeks' },
    { id: '1month', label: '1 Month' },
    { id: '2months', label: '2 Months' },
    { id: '3months', label: '3+ Months' },
];

const WORK_TYPES = [
    { id: 'onsite', label: 'On-site' },
    { id: 'remote', label: 'Remote' },
    { id: 'hybrid', label: 'Hybrid' },
];

/* ─────────────────────────────────────────
   Shared Tailwind class strings
───────────────────────────────────────── */
const inputCls =
    'h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white ' +
    'placeholder:text-white/25 outline-none ' +
    'hover:border-white/20 focus:border-[#5B4DFF]/60 focus:bg-[#5B4DFF]/[0.05] ' +
    'transition-all duration-200 w-full';

const labelCls = 'block text-xs font-medium text-white/50 mb-1.5';
const errCls = 'text-xs text-red-400 mt-1.5 flex items-center gap-1';

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function JobApply({ job, applicant, applications, plan }) {
    const fileInputRef = useRef(null);

    const [resumeFile, setResumeFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        fullName: applicant?.name ?? '',
        email: applicant?.email ?? '',
        phone: '',
        location: '',
        experience: '',
        noticePeriod: '',
        preferredWork: '',
        portfolioUrl: '',
        linkedinUrl: '',
        coverLetter: '',
        expectedSalary: '',
    });

    /* helpers */
    const set = (field) => (e) => {
        const val = typeof e === 'string' ? e : e.target.value;
        setForm((p) => ({ ...p, [field]: val }));
        if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
    };

    const handleFile = (file) => {
        if (!file) return;
        const allowed = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowed.includes(file.type)) {
            setErrors((p) => ({ ...p, resume: 'Only PDF or Word documents are accepted.' }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors((p) => ({ ...p, resume: 'File must be under 5 MB.' }));
            return;
        }
        setErrors((p) => ({ ...p, resume: null }));
        setResumeFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const validate = () => {
        const next = {};
        if (!form.fullName.trim()) next.fullName = 'Full name is required.';
        if (!form.email.trim()) next.email = 'Email is required.';
        if (!form.phone.trim()) next.phone = 'Phone number is required.';
        if (!form.experience) next.experience = 'Please select your experience level.';
        if (!form.noticePeriod) next.noticePeriod = 'Please select your notice period.';
        if (!form.coverLetter.trim()) next.coverLetter = 'A cover letter is required.';
        if (!resumeFile) next.resume = 'Please upload your resume.';
        return next;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
        setErrors(errs);
        const firstKey = Object.keys(errs)[0];
        document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const formData = new FormData(e.currentTarget);

    formData.set('applicantId', applicant?.id ?? '');
    formData.set('applicant_fullName', form.fullName);
    formData.set('applicant_email', form.email);
    formData.set('applicant_phone', form.phone);
    formData.set('applicant_location', form.location);
    formData.set('applicant_experience', form.experience);
    formData.set('applicant_noticePeriod', form.noticePeriod);
    formData.set('applicant_preferredWork', form.preferredWork);
    formData.set('applicant_portfolioUrl', form.portfolioUrl);
    formData.set('applicant_linkedinUrl', form.linkedinUrl);
    formData.set('applicant_coverLetter', form.coverLetter);
    formData.set('applicant_expectedSalary', form.expectedSalary);

    if (job) {
        formData.set('jobId', job._id?.toString() ?? '');
        formData.set('jobTitle', job.job_title ?? '');
        formData.set('companyId', job.companyId ?? '');
        formData.set('companyName', job.companyName ?? '');
        formData.set('companyLogo', job.companyLogo ?? '');
    }

    if (resumeFile) {
        formData.set('resume', resumeFile);
    }

    const payload = Object.fromEntries(formData.entries());
    console.log('Submitting application payload:', payload);

    const res = await submitApplication(payload);
    if (res.insertedId) {
        toast.success('Application submitted successfully!');
        setSubmitted(true);
    } else {
        toast.error('Failed to submit application. Please try again later.');
    }
};

    if (submitted) {
        return (
            <section className="relative min-h-screen overflow-hidden bg-[#090909] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#1B1440_0%,#090909_55%,#000_100%)]" />
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:72px_72px]" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[480px] h-[320px] bg-[#6D5FFF]/[0.12] blur-[120px] rounded-full" />

                <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full px-6 py-20">
                    <div className="w-20 h-20 rounded-full bg-[#5B4DFF]/15 border border-[#5B4DFF]/40 flex items-center justify-center mb-6">
                        <BsCheck className="w-9 h-9 text-[#a59fff]" />
                    </div>
                    <h1 className="text-3xl font-semibold text-white tracking-tight mb-3">
                        Application Submitted!
                    </h1>
                    <p className="text-white/50 text-[15px] leading-7 mb-8">
                        Your application for{' '}
                        <span className="text-white/80 font-medium">{job?.job_title ?? 'this role'}</span>{' '}
                        has been sent. The team will be in touch soon.
                    </p>
                    <Link
                        href="/browse-jobs"
                        className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[14px] bg-[#5B4DFF] text-sm font-medium text-white px-8 hover:bg-[#6D5FFF] transition-all duration-300 hover:scale-[1.02]"
                    >
                        <BsArrowLeft className="w-4 h-4" />
                        Back to Browse Jobs
                    </Link>
                </div>
            </section>
        );
    }

    /* ── Main form ────────────────────────── */
    return (
        <section className="relative min-h-screen overflow-hidden bg-[#090909]">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1B1440_0%,#090909_50%,#000_100%)]" />
            <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:72px_72px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#6D5FFF]/[0.10] blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute top-16 left-[10%] w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_18px_5px_rgba(255,255,255,0.3)]" />
            <div className="absolute top-28 right-[12%] w-1.5 h-1.5 rounded-full bg-[#6D5FFF] shadow-[0_0_22px_7px_rgba(109,95,255,0.5)]" />

            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">

                <ApplicationLimitCard applications={applications} plan={plan} />

                {/* Back link */}
                <Link
                    href={job?._id ? `/browse-jobs/${job._id}` : '/browse-jobs'}
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors duration-200 mb-8 group"
                >
                    <BsArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    Back
                </Link>

                {/* Page header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-xl mb-5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B4DFF]">
                            <BsRocket className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-white/55 font-medium">
                            Job Application
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-snug mb-2">
                        Apply for{' '}
                        <span className="text-[#a59fff]">{job?.job_title ?? 'this Position'}</span>
                    </h1>

                    {(job?.companyName || job?.location) && (
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            {job?.companyName && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/60">
                                    <BsBriefcaseFill className="w-3 h-3" />
                                    {job.companyName}
                                </span>
                            )}
                            {job?.location && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/60">
                                    <BsGeoAlt className="w-3 h-3" />
                                    {job.location}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Job summary card */}
                {job && (
                    <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-2xl p-6 sm:p-7">
                        <div className="flex items-center gap-4 mb-5">
                            {job.companyLogo ? (
                                <img
                                    src={job.companyLogo}
                                    alt={job.companyName ?? 'Company logo'}
                                    className="h-12 w-12 rounded-xl object-cover border border-white/10 bg-white/[0.05]"
                                />
                            ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                                    <BsBriefcaseFill className="w-5 h-5 text-[#a59fff]" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-[15px] font-semibold text-white leading-none mb-1">
                                    {job.job_title}
                                </h2>
                                <p className="text-xs text-white/40">
                                    {job.companyName}{job.location ? ` · ${job.location}` : ''}
                                </p>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/[0.06] mb-5" />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                            {job.job_type && (
                                <SummaryStat icon={<BsBriefcaseFill className="w-3.5 h-3.5" />} label="Job Type" value={capitalize(job.job_type)} />
                            )}
                            {job.job_category && (
                                <SummaryStat icon={<BsListUl className="w-3.5 h-3.5" />} label="Category" value={capitalize(job.job_category)} />
                            )}
                            {(job.min_salary || job.max_salary) && (
                                <SummaryStat
                                    icon={<span className="text-[11px] font-semibold">{job.currency ?? '$'}</span>}
                                    label="Salary"
                                    value={formatSalary(job)}
                                />
                            )}
                            {job.deadline && (
                                <SummaryStat icon={<BsCalendar className="w-3.5 h-3.5" />} label="Apply By" value={formatDate(job.deadline)} />
                            )}
                        </div>

                        {job.responsibilities && (
                            <JobDetailBlock title="Responsibilities" text={job.responsibilities} />
                        )}
                        {job.requirements && (
                            <JobDetailBlock title="Requirements" text={job.requirements} />
                        )}
                        {job.benefits && (
                            <JobDetailBlock title="Benefits" text={job.benefits} last />
                        )}
                    </div>
                )}

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-5">

                        {/* Section 1 — Personal Info */}
                        <SectionCard
                            icon={<BsPersonFill className="w-4 h-4 text-[#a59fff]" />}
                            title="Personal Information"
                            subtitle="Your basic contact details"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Full Name */}
                                <div id="field-fullName">
                                    <label htmlFor="fullName" className={labelCls}>Full Name</label>
                                    <div className="relative">
                                        <BsPerson className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
                                        <input
                                            id="fullName"
                                            type="text"
                                            placeholder="Zabed Mahmud"
                                            value={form.fullName}
                                            onChange={set('fullName')}
                                            className={`${inputCls} pl-9 ${errors.fullName ? 'border-red-500/60' : ''}`}
                                        />
                                    </div>
                                    {errors.fullName && <ErrMsg>{errors.fullName}</ErrMsg>}
                                </div>

                                {/* Email */}
                                <div id="field-email">
                                    <label htmlFor="email" className={labelCls}>Email Address</label>
                                    <div className="relative">
                                        <BsEnvelopeFill className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="you@email.com"
                                            value={form.email}
                                            onChange={set('email')}
                                            className={`${inputCls} pl-9 ${errors.email ? 'border-red-500/60' : ''}`}
                                        />
                                    </div>
                                    {errors.email && <ErrMsg>{errors.email}</ErrMsg>}
                                </div>

                                {/* Phone */}
                                <div id="field-phone">
                                    <label htmlFor="phone" className={labelCls}>Phone Number</label>
                                    <div className="relative">
                                        <BsTelephone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="+880 1XXXXXXXXX"
                                            value={form.phone}
                                            onChange={set('phone')}
                                            className={`${inputCls} pl-9 ${errors.phone ? 'border-red-500/60' : ''}`}
                                        />
                                    </div>
                                    {errors.phone && <ErrMsg>{errors.phone}</ErrMsg>}
                                </div>

                                {/* Location */}
                                <div>
                                    <label htmlFor="location" className={labelCls}>Current Location</label>
                                    <div className="relative">
                                        <BsGeoAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
                                        <input
                                            id="location"
                                            type="text"
                                            placeholder="Dhaka, Bangladesh"
                                            value={form.location}
                                            onChange={set('location')}
                                            className={`${inputCls} pl-9`}
                                        />
                                    </div>
                                </div>

                            </div>
                        </SectionCard>

                        {/* Section 2 — Professional Details */}
                        <SectionCard
                            icon={<BsBriefcaseFill className="w-4 h-4 text-[#a59fff]" />}
                            title="Professional Details"
                            subtitle="Help us understand where you stand"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Experience */}
                                <div id="field-experience">
                                    <label className={labelCls}>Experience Level</label>
                                    <NativeSelect
                                        value={form.experience}
                                        onChange={set('experience')}
                                        hasError={!!errors.experience}
                                        placeholder="Select level"
                                        options={EXPERIENCE_LEVELS}
                                    />
                                    {errors.experience && <ErrMsg>{errors.experience}</ErrMsg>}
                                </div>

                                {/* Expected Salary */}
                                <div>
                                    <label htmlFor="expectedSalary" className={labelCls}>Expected Salary (USD / yr)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/35 pointer-events-none">$</span>
                                        <input
                                            id="expectedSalary"
                                            type="text"
                                            placeholder="e.g. 60,000"
                                            value={form.expectedSalary}
                                            onChange={set('expectedSalary')}
                                            className={`${inputCls} pl-7`}
                                        />
                                    </div>
                                </div>

                                {/* Notice Period */}
                                <div id="field-noticePeriod">
                                    <label className={labelCls}>Notice Period</label>
                                    <NativeSelect
                                        value={form.noticePeriod}
                                        onChange={set('noticePeriod')}
                                        hasError={!!errors.noticePeriod}
                                        placeholder="When can you start?"
                                        options={NOTICE_PERIODS}
                                    />
                                    {errors.noticePeriod && <ErrMsg>{errors.noticePeriod}</ErrMsg>}
                                </div>

                                {/* Preferred Work Type */}
                                <div>
                                    <label className={labelCls}>Preferred Work Type</label>
                                    <NativeSelect
                                        value={form.preferredWork}
                                        onChange={set('preferredWork')}
                                        hasError={false}
                                        placeholder="On-site, Remote, Hybrid"
                                        options={WORK_TYPES}
                                    />
                                </div>

                            </div>
                        </SectionCard>

                        {/* Section 3 — Online Presence */}
                        <SectionCard
                            icon={<BsLink45Deg className="w-4 h-4 text-[#a59fff]" />}
                            title="Online Presence"
                            subtitle="Optional, but strongly recommended"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="portfolioUrl" className={labelCls}>Portfolio / Website</label>
                                    <div className="relative">
                                        <BsLink45Deg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
                                        <input
                                            id="portfolioUrl"
                                            type="url"
                                            placeholder="https://yourportfolio.com"
                                            value={form.portfolioUrl}
                                            onChange={set('portfolioUrl')}
                                            className={`${inputCls} pl-9`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="linkedinUrl" className={labelCls}>LinkedIn Profile</label>
                                    <div className="relative">
                                        <BsLink45Deg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
                                        <input
                                            id="linkedinUrl"
                                            type="url"
                                            placeholder="https://linkedin.com/in/yourname"
                                            value={form.linkedinUrl}
                                            onChange={set('linkedinUrl')}
                                            className={`${inputCls} pl-9`}
                                        />
                                    </div>
                                </div>

                            </div>
                        </SectionCard>

                        {/* Section 4 — Resume Upload */}
                        <SectionCard
                            icon={<BsPaperclip className="w-4 h-4 text-[#a59fff]" />}
                            title="Resume / CV"
                            subtitle="PDF or Word document — max 5 MB"
                        >
                            <div id="field-resume">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={(e) => handleFile(e.target.files[0])}
                                />

                                {!resumeFile ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                        className={[
                                            'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed',
                                            'px-6 py-10 cursor-pointer transition-all duration-300 group',
                                            dragOver
                                                ? 'border-[#6D5FFF] bg-[#5B4DFF]/10'
                                                : errors.resume
                                                    ? 'border-red-500/50 bg-red-500/[0.04] hover:border-red-400/60'
                                                    : 'border-white/15 bg-white/[0.02] hover:border-[#5B4DFF]/50 hover:bg-[#5B4DFF]/[0.04]',
                                        ].join(' ')}
                                    >
                                        <div className={[
                                            'flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300',
                                            dragOver
                                                ? 'border-[#5B4DFF]/60 bg-[#5B4DFF]/20'
                                                : 'border-white/10 bg-white/[0.05] group-hover:border-[#5B4DFF]/40 group-hover:bg-[#5B4DFF]/10',
                                        ].join(' ')}>
                                            <BsPaperclip className={`w-6 h-6 transition-colors duration-300 ${dragOver ? 'text-[#a59fff]' : 'text-white/40 group-hover:text-[#a59fff]'}`} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-white/75">
                                                Drag &amp; drop your resume here
                                            </p>
                                            <p className="text-xs text-white/35 mt-1">
                                                or{' '}
                                                <span className="text-[#a59fff] underline underline-offset-2">click to browse</span>
                                                {' '}— PDF, DOC, DOCX up to 5 MB
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 rounded-2xl border border-[#5B4DFF]/30 bg-[#5B4DFF]/[0.07] px-5 py-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5B4DFF]/20 border border-[#5B4DFF]/30">
                                            <BsPaperclip className="w-5 h-5 text-[#a59fff]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{resumeFile.name}</p>
                                            <p className="text-xs text-white/40 mt-0.5">
                                                {(resumeFile.size / 1024).toFixed(0)} KB · Ready to submit
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setResumeFile(null)}
                                            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/40 hover:text-white/80 hover:border-white/20 transition-all duration-200"
                                            aria-label="Remove file"
                                        >
                                            <BsX className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {errors.resume && <ErrMsg>{errors.resume}</ErrMsg>}
                            </div>
                        </SectionCard>

                        {/* Section 5 — Cover Letter */}
                        <SectionCard
                            icon={<BsTextLeft className="w-4 h-4 text-[#a59fff]" />}
                            title="Cover Letter"
                            subtitle="Tell the employer why you're the right fit"
                        >
                            <div id="field-coverLetter">
                                <label htmlFor="coverLetter" className={labelCls}>Cover Letter</label>
                                <textarea
                                    id="coverLetter"
                                    rows={7}
                                    placeholder="Introduce yourself, highlight relevant experience, and explain why you're excited about this role..."
                                    value={form.coverLetter}
                                    onChange={set('coverLetter')}
                                    className={[
                                        'w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white',
                                        'placeholder:text-white/25 outline-none resize-none leading-7',
                                        'hover:border-white/20 focus:border-[#5B4DFF]/60 focus:bg-[#5B4DFF]/[0.05]',
                                        'transition-all duration-200',
                                        errors.coverLetter ? 'border-red-500/60' : 'border-white/10',
                                    ].join(' ')}
                                />
                                <div className="flex items-center justify-between mt-1.5">
                                    {errors.coverLetter
                                        ? <ErrMsg>{errors.coverLetter}</ErrMsg>
                                        : <span />
                                    }
                                    <span className="text-xs text-white/30 ml-auto">
                                        {form.coverLetter.length} chars
                                    </span>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Disclaimer */}
                        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">
                            <BsExclamationTriangle className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                            <p className="text-xs text-white/35 leading-6">
                                By submitting this application, you confirm the information provided is accurate
                                and agree to HireLoop's{' '}
                                <Link href="/terms" className="text-[#a59fff] hover:underline">Terms of Service</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-[#a59fff] hover:underline">Privacy Policy</Link>.
                                Your data will be shared with the employer for recruitment purposes only.
                            </p>
                        </div>

                        {/* Submit row */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <button
                                type="submit"
                                className="flex w-full h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[#5B4DFF] text-sm font-medium text-white hover:bg-[#6D5FFF] hover:scale-[1.01] transition-all duration-300"
                            >
                                <BsRocket className="w-4 h-4" />
                                Submit Application
                            </button>
                            <Link
                                href={job?._id ? `/browse-jobs/${job._id}` : '/browse-jobs'}
                                className="flex h-[52px] sm:w-48 items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] text-sm font-medium text-white/70 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.06] hover:text-white/90 transition-all duration-300"
                            >
                                <BsArrowLeft className="w-4 h-4" />
                                Cancel
                            </Link>
                        </div>

                    </div>
                </form>
            </div>
        </section>
    );
}


/** Glassmorphism section card */
function SectionCard({ icon, title, subtitle, children }) {
    return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-2xl">
            <div className="p-6 sm:p-7">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-[15px] font-semibold text-white leading-none mb-0.5">{title}</h2>
                        <p className="text-xs text-white/40">{subtitle}</p>
                    </div>
                </div>
                {/* Divider */}
                <div className="h-px w-full bg-white/[0.06] mb-5" />
                {children}
            </div>
        </div>
    );
}

/** Native <select> styled to match the dark theme */
function NativeSelect({ name, value, onChange, hasError, placeholder, options }) {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={[
                'h-11 w-full rounded-xl border bg-white/[0.04] px-3 text-sm outline-none',
                'hover:border-white/20 focus:border-[#5B4DFF]/60 focus:bg-[#5B4DFF]/[0.05]',
                'transition-all duration-200 appearance-none cursor-pointer',
                value ? 'text-white' : 'text-white/30',
                hasError ? 'border-red-500/60' : 'border-white/10',
            ].join(' ')}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
            <option value="" disabled hidden className="text-white/30 bg-[#13102A]">{placeholder}</option>
            {options.map((o) => (
                <option key={o.id} value={o.id} className="bg-[#13102A] text-white">{o.label}</option>
            ))}
        </select>
    );
}

/** Inline error message */
function ErrMsg({ children }) {
    return (
        <p className={errCls}>
            <BsExclamationTriangle className="w-3.5 h-3.5 shrink-0" />
            {children}
        </p>
    );
}

/** Small stat tile used in the job summary card */
function SummaryStat({ icon, label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
            <div className="flex items-center gap-1.5 text-white/35 mb-1.5">
                {icon}
                <span className="text-[11px] uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-sm font-medium text-white truncate">{value}</p>
        </div>
    );
}

/** Job detail section (responsibilities, requirements, benefits) */
function JobDetailBlock({ title, text, last }) {
    return (
        <div className={last ? '' : 'mb-4'}>
            <h3 className="text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">{title}</h3>
            <p className="text-sm text-white/65 leading-7 whitespace-pre-line">{text}</p>
        </div>
    );
}



/** Capitalize the first letter and replace underscores with spaces */
function capitalize(str) {
    if (!str) return '';
    return str
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Format a min/max salary range with currency */
function formatSalary(job) {
    const { min_salary, max_salary, currency } = job;
    const fmt = (n) => Number(n).toLocaleString();
    if (min_salary && max_salary) {
        return `${fmt(min_salary)} – ${fmt(max_salary)} ${currency ?? ''}`.trim();
    }
    if (min_salary) return `${fmt(min_salary)}+ ${currency ?? ''}`.trim();
    if (max_salary) return `Up to ${fmt(max_salary)} ${currency ?? ''}`.trim();
    return '—';
}

/** Format an ISO date string as e.g. "Jul 1, 2026" */
function formatDate(dateStr) {
    try {
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return dateStr;
    }
}