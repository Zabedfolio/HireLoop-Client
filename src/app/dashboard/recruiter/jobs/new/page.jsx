'use client';

import { createJob } from '@/lib/actions/job';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const NewJob = () => {
    const [salaryError, setSalaryError] = useState('');
    const [isRemote, setIsRemote] = useState(false);

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

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!validateSalary(data.min_salary, data.max_salary)) return;

        const res = await createJob(data);
        if(res.insertedId) {
            toast.success('Job posted successfully!');
            e.target.reset();
        } else {
            toast.error('Failed to post job. Please try again.');
        }
    };

    return (
        <div className="min-h-screen text-white flex justify-center px-4 py-10">

            <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0B0B0C] overflow-hidden">

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
                            <h2 className="text-sm font-semibold text-white/70 mb-4">
                                Job Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <input
                                    name="job_title"
                                    placeholder="Job Title"
                                    className="input" />

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
                                    {/* <option value="remote">Remote</option> */}
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>

                                <input
                                    name="deadline"
                                    placeholder="Application Deadline"
                                    type="date"
                                    className="input" />

                                {/* Salary — spans full width to fit error message neatly */}
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
                                        <p className="col-span-2 text-xs text-red-400 mt-1">
                                            {salaryError}
                                        </p>
                                    )}
                                </div>

                                <select name="currency" className="input">
                                    <option value="">Currency</option>
                                    <option value="USD">USD</option>
                                    <option value="BDT">BDT</option>
                                </select>

                                {/* Location + Remote */}
                                {/* Location + Remote */}
                                <div className="flex flex-col gap-2 w-full">
                                    <input
                                        name="location"
                                        placeholder="City, Country"
                                        value={isRemote ? 'Remote' : undefined}
                                        disabled={isRemote}
                                        className={`input transition-opacity ${isRemote ? 'opacity-30 cursor-not-allowed' : ''}`} />

                                    <div className="flex items-center gap-2 px-1">
                                        <input
                                            type="checkbox"
                                            name="is_remote"
                                            value="true"
                                            checked={isRemote}
                                            onChange={(e) => setIsRemote(e.target.checked)} />
                                        <span className="text-sm text-white/60">Remote Job</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ───── Job Description ───── */}
                        <div>
                            <h2 className="text-sm font-semibold text-white/70 mb-4">
                                Job Description
                            </h2>

                            <div className="flex flex-col space-y-4">
                                <textarea
                                    name="responsibilities"
                                    placeholder="Responsibilities..."
                                    className="textarea" />

                                <textarea
                                    name="requirements"
                                    placeholder="Requirements..."
                                    className="textarea" />

                                <textarea
                                    name="benefits"
                                    placeholder="Benefits (optional)..."
                                    className="textarea" />
                            </div>
                        </div>

                        {/* ───── Company Info ───── */}
                        <div>
                            <h2 className="text-sm font-semibold text-white/70 mb-4">
                                Company
                            </h2>

                            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                                <p className="text-sm text-white/70">
                                    Your company will be automatically linked.
                                </p>
                                <p className="text-xs text-white/40 mt-1">
                                    You must have an approved company to post jobs.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90">
                            Publish Job
                        </button>
                    </div>
                </form>

            </div>

            {/* Tailwind reusable styles */}
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