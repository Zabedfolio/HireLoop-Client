"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@heroui/react";

const navLinks = [
  { label: "Browse Jobs", href: "/browse-jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#1a1a1a] border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo */}
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

          {/* Right: Nav links + divider + Sign In + Get Started (Desktop) */}
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
          </div>

          {/* Mobile Hamburger */}
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

      {/* Mobile Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 pt-2 bg-[#1a1a1a] border-t border-white/5">
          <div className="bg-[#222222] rounded-xl px-2 py-2 flex flex-col gap-1">
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
          </div>
        </div>
      </div>
    </nav>
  );
}