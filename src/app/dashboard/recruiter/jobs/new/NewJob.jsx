'use client';

import { createJob } from '@/lib/actions/job';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const NewJob = ({ company }) => {
    const [salaryError, setSalaryError] = useState('');
    const [isRemote, setIsRemote] = useState(false);
    const [location, setLocation] = useState('');

    if (!company?._id) {
        return (
            <div className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-10">
                <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0B0B0C] p-10 text-center">
                    <h1 className="text-2xl font-semibold mb-4">Company profile required</h1>
                    <p className="text-sm text-white/60 mb-6">
                        You need to register a company before posting a job. Please add your company details first.
                    </p>
                    <Link href="/dashboard/recruiter/company" className="inline-flex items-center justify-center rounded-xl bg-[#5B4DFF] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4339d7] transition">
                        Go to My Company
                    </Link>
                </div>
            </div>
        );
    }

    const isApproved = company.status === 'approved' || company.status === 'active';

    const validateSalary = (min, max) => {
        if (min && max && Number(max) <= Number(min)) {
            setSalaryError('Max salary must be greater than min salary');
            return false;
        }
        setSalaryError('');
        return true;
    };

    const handleSalaryChange = (e) => {
        const form = e.target.closest('form');
        const min = form.querySelector('[name="min_salary"]').value;
        const max = form.querySelector('[name="max_salary"]').value;
        validateSalary(min, max);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isApproved) {
            toast.error('Your company must be approved before posting a job.');
            return;
        }
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!validateSalary(data.min_salary, data.max_salary)) return;

        const jobPayload = {
            ...data,
            companyId: company._id,
            companyName: company.company_name,
            companyLogo: company.logo,
            status: 'active',
            isPubliclyVisible: true,
        };

        const res = await createJob(jobPayload);

        if (res.insertedId) {
            toast.success('Job posted successfully!');
            e.target.reset();
            setIsRemote(false);
            setLocation('');
            redirect(`/dashboard/recruiter/`);
        } else {
            toast.error('Failed to post job. Please try again.');
        }
    };

    return (
        <div className="min-h-screen text-white flex justify-center px-4 py-10">
            <div className="w-full max-w-4xl space-y-4">

                {/* ── Approval Banner ── */}
                {!isApproved && (
                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-5 py-4 flex items-start gap-4">
                        <div className="mt-0.5 w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="#EAB308" strokeWidth="1.4" strokeLinejoin="round"/>
                                <path d="M8 6V9" stroke="#EAB308" strokeWidth="1.4" strokeLinecap="round"/>
                                <circle cx="8" cy="11" r="0.6" fill="#EAB308" stroke="#EAB308" strokeWidth="0.6"/>
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-yellow-400">Company approval required</p>
                            <p className="text-xs text-yellow-400/60 mt-0.5 leading-relaxed">
                                Your company profile is currently <span className="font-medium text-yellow-400/80">{company.status ? `"${company.status.charAt(0).toUpperCase() + company.status.slice(1)}"` : 'under review'}</span>. Job posting will be unlocked once an admin approves your company.
                            </p>
                        </div>
                        <Link
                            href="/dashboard/recruiter/company"
                            className="shrink-0 self-center text-xs font-medium text-yellow-400 border border-yellow-500/30 rounded-lg px-3 py-1.5 hover:bg-yellow-500/10 transition whitespace-nowrap">
                            View Company
                        </Link>
                    </div>
                )}

                {/* ── Main Card ── */}
                <div className={`w-full rounded-2xl border border-white/10 bg-[#0B0B0C] overflow-hidden transition-all duration-300 ${!isApproved ? 'opacity-60 pointer-events-none select-none' : ''}`}>

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold">Post a New Job</h1>
                            <p className="text-sm text-white/40 mt-1">
                                Fill in the details to publish a new job listing
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-8">

                            {/* ───── Job Info ───── */}
                            <div>
                                <h2 className="text-sm font-semibold text-white/70 mb-4">Job Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <input name="job_title" placeholder="Job Title" className="input" />

                                    <select name="job_category" className="input">
                                        <option value="">Job Category</option>
                                        <option value="engineering">Engineering</option>
                                        <option value="design">Design</option>
                                        <option value="marketing">Marketing</option>
                                    </select>

                                    <select name="job_type" className="input">
                                        <option value="">Job Type</option>
                                        <option value="full_time">Full-time</option>
                                        <option value="part_time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>

                                    <input name="deadline" placeholder="Application Deadline" type="date" className="input" />

                                    {/* Salary */}
                                    <div className="md:col-span-2 grid grid-cols-2 gap-3">
                                        <input
                                            name="min_salary"
                                            placeholder="Min Salary"
                                            type="number"
                                            onChange={handleSalaryChange}
                                            className={`input ${salaryError ? 'border-red-500/60' : ''}`} />
                                        <input
                                            name="max_salary"
                                            placeholder="Max Salary"
                                            type="number"
                                            onChange={handleSalaryChange}
                                            className={`input ${salaryError ? 'border-red-500/60' : ''}`} />
                                        {salaryError && (
                                            <p className="col-span-2 text-xs text-red-400 mt-1">{salaryError}</p>
                                        )}
                                    </div>

                                    <select name="currency" className="input">
                                        <option value="">Currency</option>
                                        <option value="USD">USD</option>
                                        <option value="BDT">BDT</option>
                                    </select>

                                    {/* Location + Remote */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <input
                                            name="location"
                                            placeholder="City, Country"
                                            value={location}
                                            readOnly={isRemote}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className={`input transition-opacity ${isRemote ? 'opacity-30 cursor-not-allowed' : ''}`} />
                                        <div className="flex items-center gap-2 px-1">
                                            <input
                                                type="checkbox"
                                                name="is_remote"
                                                value="true"
                                                checked={isRemote}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setIsRemote(checked);
                                                    setLocation(checked ? 'Remote' : '');
                                                }} />
                                            <span className="text-sm text-white/60">Remote Job</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* ───── Job Description ───── */}
                            <div>
                                <h2 className="text-sm font-semibold text-white/70 mb-4">Job Description</h2>
                                <div className="flex flex-col space-y-4">
                                    <textarea name="responsibilities" placeholder="Responsibilities..." className="textarea" />
                                    <textarea name="requirements" placeholder="Requirements..." className="textarea" />
                                    <textarea name="benefits" placeholder="Benefits (optional)..." className="textarea" />
                                </div>
                            </div>

                            {/* ───── Company Info ───── */}
                            <div>
                                <h2 className="text-sm font-semibold text-white/70 mb-4">Company</h2>
                                <div className="p-4 rounded-xl border border-white/10 bg-white/2 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        {company.logo ? (
                                            <img src={company.logo} alt={company.company_name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/30 text-lg">
                                                🏢
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-white">{company.company_name}</p>
                                            <p className="text-xs text-white/40 mt-0.5">Linked automatically on submit</p>
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
                                        ${isApproved
                                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                            : company.status === 'pending'
                                                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-green-400' : company.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                                        {company.status
                                            ? company.status.charAt(0).toUpperCase() + company.status.slice(1)
                                            : 'Unknown'}
                                    </span>
                                </div>
                            </div>

                        </div>

                        {/* ───── Footer ───── */}
                        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3">
                            {!isApproved && (
                                <p className="text-xs text-yellow-400/70 flex items-center gap-1.5">
                                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="#EAB308" strokeWidth="1.4" strokeLinejoin="round"/>
                                        <path d="M8 6V9" stroke="#EAB308" strokeWidth="1.4" strokeLinecap="round"/>
                                        <circle cx="8" cy="11" r="0.6" fill="#EAB308" stroke="#EAB308" strokeWidth="0.6"/>
                                    </svg>
                                    Posting is disabled until your company is approved
                                </p>
                            )}
                            <div className="flex gap-3 ml-auto">
                                <button type="button" className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white transition">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!isApproved}
                                    title={!isApproved ? 'Company must be approved to post a job' : ''}
                                    className={`px-5 py-2 rounded-lg font-medium transition
                                        ${isApproved
                                            ? 'bg-white text-black hover:opacity-90 cursor-pointer'
                                            : 'bg-white/10 text-white/30 cursor-not-allowed'
                                        }`}>
                                    Publish Job
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

            <style jsx>{`
                .input {
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: white;
                    font-size: 14px;
                    outline: none;
                }
                select.input {
                    padding-right: 36px;
                    appearance: none;
                    -webkit-appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                }
                .input:focus {
                    border-color: rgba(255,255,255,0.2);
                    background: rgba(255,255,255,0.05);
                }
                .textarea {
                    width: 100%;
                    min-height: 110px;
                    padding: 12px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: white;
                    font-size: 14px;
                    resize: none;
                    outline: none;
                }
                .textarea:focus {
                    border-color: rgba(255,255,255,0.2);
                    background: rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    );
};

export default NewJob;