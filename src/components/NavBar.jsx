"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import { useSession, authClient } from "@/lib/auth-client";

// Gravity UI icons — each is a standalone SVG React component
import Person from "@gravity-ui/icons/Person";
import Briefcase from "@gravity-ui/icons/Briefcase";
import Gear from "@gravity-ui/icons/Gear";
import ArrowRightFromSquare from "@gravity-ui/icons/ArrowRightFromSquare";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Jobs", href: "/browse-jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger pill */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full pl-1 pr-3 py-1 transition-all duration-200"
      >
        <Image
          src={user.image || "/images/default-avatar.png"}
          alt={user.name ?? "avatar"}
          width={28}
          height={28}
          className="rounded-full ring-1 ring-white/20"
        />
        <span className="text-sm font-medium text-white max-w-[90px] truncate">
          {user.name?.split(" ")[0]}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown card */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
          {/* Profile header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
            <Image
              src={user.image || "/images/default-avatar.png"}
              alt={user.name ?? "avatar"}
              width={38}
              height={38}
              className="rounded-full ring-2 ring-[#5C53FE]/40"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="px-2 py-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Person className="w-4 h-4 shrink-0" />
              My Profile
            </Link>
            <Link
              href="/my-jobs"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              My Applications
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Gear className="w-4 h-4 shrink-0" />
              Settings
            </Link>
          </div>

          {/* Logout */}
          <div className="px-2 pb-2 border-t border-white/10 pt-1.5">
            <button
              onClick={async () => {
                await authClient.signOut();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <ArrowRightFromSquare className="w-4 h-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 bg-[#222222] rounded-lg px-2 py-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors duration-200 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-5 bg-white/20 mx-1" />

            {isPending ? (
              <div className="w-28 h-8 bg-white/10 rounded-full animate-pulse" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ color: "#5C53FE" }}
                >
                  Sign In
                </Link>
                <Button
                  as={Link}
                  href="/get-started"
                  className="bg-white text-black text-sm font-semibold px-5 h-9 rounded-lg hover:bg-gray-100 transition-colors duration-200 min-w-0 ml-1"
                  radius="lg"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 pt-2">
          <div className="rounded-xl px-2 py-2 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-1 mx-2" />

            {isPending ? (
              <div className="h-9 mx-2 bg-white/10 rounded-lg animate-pulse" />
            ) : user ? (
              /* Mobile logged-in: inline profile strip */
              <div className="mx-2 mt-1 rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-white/5">
                  <Image
                    src={user.image || "/images/default-avatar.png"}
                    alt={user.name ?? "avatar"}
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-[#5C53FE]/40"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-white/40 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex border-t border-white/10">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 flex flex-col items-center gap-1 text-white/60 hover:text-white hover:bg-white/5 py-2.5 transition-colors"
                  >
                    <Person className="w-4 h-4" />
                    <span className="text-xs">Profile</span>
                  </Link>
                  <div className="w-px bg-white/10" />
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 flex flex-col items-center gap-1 text-white/60 hover:text-white hover:bg-white/5 py-2.5 transition-colors"
                  >
                    <Gear className="w-4 h-4" />
                    <span className="text-xs">Settings</span>
                  </Link>
                  <div className="w-px bg-white/10" />
                  <button
                    onClick={async () => {
                      await authClient.signOut();
                      setMenuOpen(false);
                    }}
                    className="flex-1 flex flex-col items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2.5 transition-colors"
                  >
                    <ArrowRightFromSquare className="w-4 h-4" />
                    <span className="text-xs">Sign out</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: "#5C53FE" }}
                >
                  Sign In
                </Link>
                <Button
                  as={Link}
                  href="/get-started"
                  onClick={() => setMenuOpen(false)}
                  className="bg-white text-black text-sm font-semibold h-9 rounded-xl hover:bg-gray-100 transition-colors min-w-0 mx-2 mt-1"
                  radius="lg"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}