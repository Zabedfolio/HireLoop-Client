'use client';

import JobCard from '@/components/Jobcard';
import { getAllJobs } from '@/lib/api/jobs';
import React, { useState, useMemo, useEffect, useRef } from 'react';

const JOB_TYPES = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Freelance', value: 'freelance' },
];

const SORT_OPTIONS = ['Most Recent', 'Highest Salary', 'Most Relevant'];
const JOBS_PER_PAGE = 4;

// ─── Icons ─────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

// ─── Skeleton Card ─────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 animate-pulse">
    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-[#1e1e1e] flex-shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-[#1e1e1e] rounded w-2/5" />
      <div className="h-3 bg-[#1a1a1a] rounded w-1/3" />
      <div className="flex gap-2 mt-2">
        <div className="h-6 bg-[#1a1a1a] rounded-md w-20" />
        <div className="h-6 bg-[#1a1a1a] rounded-md w-16" />
      </div>
    </div>
  </div>
);

// ─── Pagination ────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-8 sm:mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#666666] hover:border-[#444444] hover:text-[#aaaaaa] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeftIcon />
      </button>

      {pages().map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#555555] text-sm">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page
              ? 'bg-white text-black'
              : 'border border-[#2a2a2a] text-[#888888] hover:border-[#444444] hover:text-white'
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-[#2a2a2a] text-[#666666] hover:border-[#444444] hover:text-[#aaaaaa] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

// ─── Mobile Filter Sheet ───────────────────────────────────────────────────
const MobileFilterSheet = ({ selectedTypes, toggleType, onClose, jobTypeOptions }) => (
  <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden" onClick={onClose}>
    <div
      className="bg-[#0e0e0e] border-t border-[#2a2a2a] rounded-t-2xl p-6 pb-10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold text-base">Filters</h2>
        <button onClick={onClose} className="text-[#666666] hover:text-white transition-colors text-sm">Done</button>
      </div>

      <p className="text-[#888888] text-xs font-medium uppercase tracking-wider mb-3">Job Type</p>
      <div className="space-y-4">
        {jobTypeOptions.map(({ label, value, count }) => (
          <label key={value} className="flex items-center justify-between cursor-pointer group" onClick={() => toggleType(value)}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedTypes.includes(value) ? 'bg-white border-white' : 'border-[#3a3a3a]'
                }`}>
                {selectedTypes.includes(value) && (
                  <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#aaaaaa]">{label}</span>
            </div>
            <span className="text-xs text-[#555555]">
              {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
            </span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────
const BrowseJobsPage = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('Most Recent');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const jobTypeOptions = useMemo(() => {
    const counts = JOB_TYPES.reduce((acc, type) => {
      acc[type.value] = 0;
      return acc;
    }, {});

    allJobs.forEach((job) => {
      const normalized = String(job.job_type ?? '')
        .toLowerCase()
        .replace(/[-_\s]+/g, '-');

      if (Object.prototype.hasOwnProperty.call(counts, normalized)) {
        counts[normalized] += 1;
      }
    });

    return JOB_TYPES.map((type) => ({
      ...type,
      count: counts[type.value] ?? 0,
    }));
  }, [allJobs]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllJobs();
        setAllJobs(Array.isArray(data) ? data : data?.jobs ?? []);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const toggleType = (value) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredJobs = useMemo(() => {
    let jobs = [...allJobs];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.job_title?.toLowerCase().includes(q) ||
          j.companyName?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.job_category?.toLowerCase().includes(q)
      );
    }

    if (selectedTypes.length > 0) {
      jobs = jobs.filter((j) => {
        const type = j.job_type?.toLowerCase().replace(/[-_\s]/g, '');
        return selectedTypes.some((t) => {
          const selected = t.toLowerCase().replace(/[-_\s]/g, '');
          return type === selected || type?.includes(selected);
        });
      });
    }

    if (sortBy === 'Highest Salary') {
      jobs.sort((a, b) => parseInt(b.max_salary) - parseInt(a.max_salary));
    }

    return jobs;
  }, [allJobs, searchQuery, selectedTypes, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const activeFilterCount = selectedTypes.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Search Bar ── */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555555]">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by job title, keywords..."
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-sm text-[#cccccc] placeholder-[#444444] focus:outline-none focus:border-[#3a3a3a] transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-[#e8e8e8] active:bg-[#d0d0d0] transition-colors whitespace-nowrap"
          >
            Search Jobs
          </button>
        </div>
      </div>

      {/* ── Mobile: active filter chips + filter button ── */}
      <div className="sm:hidden px-4 py-3 border-b border-[#1a1a1a] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-[#2a2a2a] rounded-lg text-xs text-[#888888] hover:border-[#444444] hover:text-white transition-colors"
        >
          <FilterIcon />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {selectedTypes.map((type) => {
          const label = jobTypeOptions.find((t) => t.value === type)?.label ?? type;
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-xs text-[#cccccc]"
            >
              {label}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M7.5 2.5l-5 5M2.5 2.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex gap-6">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden sm:block w-56 lg:w-60 flex-shrink-0">
          <div className="bg-[#0e0e0e] border border-[#1e1e1e] rounded-xl p-5 sticky top-4">
            <h2 className="text-white font-semibold text-base mb-4">Filters</h2>
            <div>
              <p className="text-[#888888] text-xs font-medium uppercase tracking-wider mb-3">Job Type</p>
              <div className="space-y-3">
                {jobTypeOptions.map(({ label, value, count }) => (
                  <label key={value} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div
                        onClick={() => toggleType(value)}
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${selectedTypes.includes(value)
                          ? 'bg-white border-white'
                          : 'border-[#3a3a3a] group-hover:border-[#555555]'
                          }`}
                      >
                        {selectedTypes.includes(value) && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        onClick={() => toggleType(value)}
                        className="text-sm text-[#aaaaaa] group-hover:text-[#cccccc] transition-colors"
                      >
                        {label}
                      </span>
                    </div>
                    <span className="text-xs text-[#555555]">
                      {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Job Listings ── */}
        <main className="flex-1 min-w-0">

          {/* Header row */}
          <div className="flex items-center justify-between mb-4 sm:mb-5 gap-3">
            <h1 className="text-white text-base sm:text-xl font-bold leading-tight">
              {loading ? (
                <span className="text-[#555555]">Loading...</span>
              ) : (
                <>
                  <span className="hidden sm:inline">Found </span>
                  <span className="text-white">{filteredJobs.length.toLocaleString()}</span>
                  <span className="hidden sm:inline"> Professional</span> Jobs
                </>
              )}
            </h1>

            {/* Sort dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setSortDropdownOpen((o) => !o)}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-[#aaaaaa] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="text-[#555555] hidden sm:inline">Sort by:</span>
                <span className="font-medium text-white">{sortBy}</span>
                <ChevronDownIcon />
              </button>

              {sortDropdownOpen && (
                <div className="absolute right-0 top-8 z-20 bg-[#161616] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-xl w-44">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setSortDropdownOpen(false); setCurrentPage(1); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === opt
                        ? 'bg-[#222222] text-white'
                        : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: JOBS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-16">
              <p className="text-[#ef4444] font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-5 py-2 text-sm border border-[#3a3a3a] text-[#aaaaaa] rounded-lg hover:border-[#555555] hover:text-white transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && paginatedJobs.length === 0 && (
            <div className="text-center py-16 text-[#555555]">
              <p className="text-lg font-medium text-[#444444]">No jobs found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Cards */}
          {!loading && !error && paginatedJobs.length > 0 && (
            <div className="space-y-2.5 sm:space-y-3">
              {paginatedJobs.map((job) => (
                <JobCard key={job._id?.$oid ?? job._id} {...job} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && filteredJobs.length > JOBS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>

      {/* Mobile filter sheet */}
      {mobileFiltersOpen && (
        <MobileFilterSheet
          selectedTypes={selectedTypes}
          toggleType={toggleType}
          onClose={() => setMobileFiltersOpen(false)}
          jobTypeOptions={jobTypeOptions}
        />
      )}

      {/* Close sort dropdown on outside click */}
      {sortDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
      )}
    </div>
  );
};

export default BrowseJobsPage;