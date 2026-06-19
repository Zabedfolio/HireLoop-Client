'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import LayoutCellsLarge from '@gravity-ui/icons/LayoutCellsLarge';
import LayoutSideContentLeft from '@gravity-ui/icons/LayoutSideContentLeft';
import Briefcase from '@gravity-ui/icons/Briefcase';
import Persons from '@gravity-ui/icons/Persons';
import Gear from '@gravity-ui/icons/Gear';
import House from '@gravity-ui/icons/House';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, CreditCard, FileText, Magnifier } from '@gravity-ui/icons';

const recruiterNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutCellsLarge, href: '/dashboard/recruiter' },
    { id: 'company', label: 'My Company', icon: House, href: '/dashboard/recruiter/company' },
    { id: 'jobs', label: 'Manage Jobs', icon: Briefcase, href: '/dashboard/recruiter/jobs' },
    { id: 'applications', label: 'Applications', icon: Persons, href: '/dashboard/recruiter/applications' },
    { id: 'settings', label: 'Settings', icon: Gear, href: '/dashboard/recruiter/settings' },
];

const jobSeekerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutCellsLarge, href: '/dashboard/job-seeker' },
    { id: 'jobs', label: 'Jobs', icon: Magnifier, href: '/dashboard/job-seeker/jobs' },
    { id: 'saved-jobs', label: 'Saved Jobs', icon: Bookmark, href: '/dashboard/job-seeker/saved-jobs' },
    { id: 'applications', label: 'Applications', icon: FileText, href: '/dashboard/job-seeker/applications' },
    { id: 'billing', label: 'Billing', icon: CreditCard, href: '/dashboard/job-seeker/billing' },
    { id: 'settings', label: 'Settings', icon: Gear, href: '/dashboard/job-seeker/settings' },
];

const navLinksMap = {
    job_seeker: jobSeekerNavItems,
    recruiter: recruiterNavItems
}

function getInitials(name) {
    if (!name) return '??';
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function routeToNavId(pathname, navItems) {
    if (!pathname) return 'dashboard';
    const matched = navItems.find((item) => item.id !== 'dashboard' && pathname.startsWith(item.href));
    return matched ? matched.id : 'dashboard';
}

/* ─────────────────────────────────────────────
   Shared nav list — used in both drawer & desktop
───────────────────────────────────────────── */
function NavList({ navItems, active, setActive, collapsed = false, onClose }) {
    return (
        <nav className={`flex-1 py-6 space-y-1 ${collapsed ? 'px-2' : 'px-4'}`}>
            {navItems.map(({ id, label, href, icon: Icon }) => {
                const isActive = active === id;
                return (
                    <Link
                        key={id}
                        href={href}
                        onClick={() => { setActive(id); onClose?.(); }}
                        title={collapsed ? label : undefined}
                        className={`
                            group relative flex items-center
                            rounded-2xl transition-all duration-200 no-underline
                            ${collapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3'}
                            ${isActive
                                ? 'bg-[#5C53FE]/15 border border-[#5C53FE]/30 text-white'
                                : 'text-white/60 hover:bg-white/[0.04] hover:text-white border border-transparent'
                            }
                        `}
                    >
                        {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-[#5C53FE]" />
                        )}
                        <Icon width={18} height={18} />
                        {!collapsed && (
                            <span className="font-medium text-sm">{label}</span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

/* ─────────────────────────────────────────────
   Full sidebar content (drawer + desktop expanded)
───────────────────────────────────────────── */
function FullSidebarContent({ navItems, active, setActive, onToggle, onClose }) {
    const { data: session } = useSession();
    const userName = session?.user?.name ?? 'Unknown User';
    const userRole = session?.user?.role ?? 'Recruiter';
    const rawPlan = session?.user?.plan ?? 'free'
    const userPlan = rawPlan.includes('_')
        ? rawPlan.split('_')[1].replace(/^\w/, c => c.toUpperCase())
        : rawPlan.replace(/^\w/, c => c.toUpperCase())
    const userImage = session?.user?.image || null;
    const initials = getInitials(userName);

    return (
        <>
            {/* Header row: logo + collapse toggle */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <Image
                        src="/images/logo.png"
                        alt="Programming Hero Logo"
                        width={86}
                        height={86}
                        className="rounded-lg"
                        priority
                    />
                </Link>
                <button
                    onClick={onToggle}
                    className="
                        hidden lg:flex
                        h-8 w-8 rounded-lg items-center justify-center
                        text-white/50 hover:text-white hover:bg-white/[0.06]
                        transition-colors duration-200
                    "
                    aria-label="Collapse sidebar"
                >
                    <LayoutSideContentLeft width={17} height={17} />
                </button>
            </div>

            {/* Recruiter card */}
            <div className="px-4 pt-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 shrink-0 rounded-2xl overflow-hidden flex items-center justify-center text-white text-sm font-bold ${!userImage ? 'bg-gradient-to-br from-[#5C53FE] to-[#7A73FF]' : ''}`}>
                            {userImage
                                ? <img src={userImage} alt={userName} className="h-full w-full object-cover" />
                                : initials
                            }
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-white text-sm font-semibold truncate">{userName}</h3>
                            <p className="text-white/50 text-xs">{userRole}</p>
                        </div>
                    </div>
                    <div className="mt-3 inline-flex rounded-full bg-[#5C53FE]/15 border border-[#5C53FE]/30 px-3 py-1">
                        <span className="text-[#8E87FF] text-xs font-medium">{userPlan}</span>
                    </div>
                </div>
            </div>

            <NavList navItems={navItems} active={active} setActive={setActive} onClose={onClose} />

            {/* Bottom help card */}
            <div className="p-4">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#5C53FE]/20 to-transparent p-4">
                    <p className="text-white text-sm font-medium">Need help?</p>
                    <p className="text-white/60 text-xs mt-1">Contact our support team anytime.</p>
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────
   Icon-only rail (desktop collapsed state)
───────────────────────────────────────────── */
function CollapsedRail({ navItems, active, setActive, onToggle }) {
    const { data: session } = useSession();
    const userName = session?.user?.name ?? 'Unknown User';
    const userImage = session?.user?.image || null;
    const initials = getInitials(userName);
    return (
        <div className="flex flex-col items-center py-5 gap-2 h-full">
            {/* Expand button at top */}
            <button
                onClick={onToggle}
                className="
                    h-9 w-9 rounded-xl flex items-center justify-center mb-2
                    text-white/50 hover:text-white hover:bg-white/[0.06]
                    transition-colors duration-200
                "
                aria-label="Expand sidebar"
            >
                <LayoutSideContentLeft width={18} height={18} />
            </button>

            {/* Avatar dot */}
            <div className={`h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center text-white text-xs font-bold mb-2 ${!userImage ? 'bg-gradient-to-br from-[#5C53FE] to-[#7A73FF]' : ''}`}>
                {userImage
                    ? <img src={userImage} alt={userName} className="h-full w-full object-cover" />
                    : initials
                }
            </div>

            <div className="w-full px-2 h-px bg-white/10 my-1" />

            <NavList navItems={navItems} active={active} setActive={setActive} collapsed />
        </div>
    );
}


export default function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role ?? 'job_seeker';
    const navItems = navLinksMap[role || 'job_seeker'];
    const active = routeToNavId(pathname || navItems[0]?.href, navItems);
    const setActive = () => { };
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>

            <div className="
                lg:hidden
                flex items-center gap-3
                px-4 py-3
                border-b border-white/10
                bg-[#080808]
                shrink-0
                w-full
            ">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="
                        h-9 w-9 rounded-xl
                        border border-white/10 bg-white/[0.04]
                        flex items-center justify-center
                        text-white/70 hover:text-white
                        transition-colors duration-200
                    "
                    aria-label="Open sidebar"
                >
                    <LayoutSideContentLeft width={18} height={18} />
                </button>
                <h1 className="text-white text-sm font-semibold tracking-wide">
                    Dashboard Sidebar
                </h1>
            </div>

            {/* Mobile backdrop */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-overlay"
                        onClick={() => setMobileOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 bg-black/60 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.aside
                        key="mobile-drawer"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.22 }}
                        className="
                            lg:hidden
                            fixed top-0 left-0 z-50
                            h-screen w-[280px]
                            bg-[#080808] border-r border-white/10
                            flex flex-col
                        "
                    >
                        <FullSidebarContent
                            navItems={navItems}
                            active={active}
                            setActive={setActive}
                            onClose={() => setMobileOpen(false)}
                        />
                    </motion.aside>
                )}
            </AnimatePresence>


            <motion.aside
                animate={{ width: collapsed ? 68 : 280 }}
                transition={{ type: 'tween', duration: 0.22 }}
                className="
                    hidden lg:flex flex-col
                    h-screen sticky top-0 shrink-0
                    bg-[#080808] border-r border-white/10
                    overflow-hidden
                "
            >
                {collapsed
                    ? <CollapsedRail
                        navItems={navItems}
                        active={active}
                        setActive={setActive}
                        onToggle={() => setCollapsed(false)}
                    />
                    : <FullSidebarContent
                        navItems={navItems}
                        active={active}
                        setActive={setActive}
                        onToggle={() => setCollapsed(true)}
                    />
                }
            </motion.aside>
        </>
    );
}