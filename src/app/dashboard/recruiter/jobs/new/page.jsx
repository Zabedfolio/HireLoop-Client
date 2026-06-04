'use client';

import React from 'react';

const NewJob = () => {
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

                <div className="p-6 space-y-8">

                    {/* ───── Job Info ───── */}
                    <div>
                        <h2 className="text-sm font-semibold text-white/70 mb-4">
                            Job Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <input placeholder="Job Title"
                                className="input" />

                            <select className="input">
                                <option>Job Category</option>
                                <option>Engineering</option>
                                <option>Design</option>
                            </select>

                            <select className="input">
                                <option>Job Type</option>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Remote</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>

                            <input placeholder="Application Deadline"
                                type="date"
                                className="input" />

                            {/* Salary */}
                            <div className="grid grid-cols-2 gap-3">
                                <input placeholder="Min Salary" className="input" />
                                <input placeholder="Max Salary" className="input" />
                            </div>

                            <select className="input">
                                <option>Currency</option>
                                <option>USD</option>
                                <option>BDT</option>
                            </select>

                            {/* Location */}
                            <input placeholder="City, Country"
                                className="input" />

                            <div className="flex items-center gap-2 mt-2">
                                <input type="checkbox" />
                                <span className="text-sm text-white/60">Remote Job</span>
                            </div>

                        </div>
                    </div>

                    
                    {/* ───── Job Description ───── */}
                    <div>
                        <h2 className="text-sm font-semibold text-white/70 mb-4">
                            Job Description
                        </h2>

                        <div className="flex flex-col space-y-4">  {/* ← add flex flex-col */}
                            <textarea placeholder="Responsibilities..." className="textarea" />
                            <textarea placeholder="Requirements..." className="textarea" />
                            <textarea placeholder="Benefits (optional)..." className="textarea" />
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
                    <button className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white">
                        Cancel
                    </button>

                    <button className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90">
                        Publish Job
                    </button>
                </div>

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

    .textarea { ... }
    .textarea:focus { ... }
`}</style>

        </div>
    );
};

export default NewJob;