import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaPinterestP, FaLinkedinIn } from "react-icons/fa";

const footerLinks = {
  Product: [
    { label: "Job discovery", href: "/job-discovery" },
    { label: "Worker AI", href: "/worker-ai" },
    { label: "Companies", href: "/companies" },
    { label: "Salary data", href: "/salary-data" },
  ],
  Navigations: [
    { label: "Help center", href: "/help-center" },
    { label: "Career library", href: "/career-library" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Brand Guideline", href: "/brand-guideline" },
    { label: "Newsroom", href: "/newsroom" },
  ],
};

const socialLinks = [
  { icon: <FaFacebookF size={16} />, href: "https://facebook.com", label: "Facebook", active: false },
  { icon: <FaPinterestP size={16} />, href: "https://pinterest.com", label: "Pinterest", active: true },
  { icon: <FaLinkedinIn size={16} />, href: "https://linkedin.com", label: "LinkedIn", active: false },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-0 justify-between">

          {/* Left: Logo + tagline */}
          <div className="flex flex-col gap-5 max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="HireLoop Logo"
                width={120}
                height={120}
                className="rounded-lg"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The AI-native career platform. Built for<br />
              people who take their work seriously.
            </p>
          </div>

          {/* Right: Link columns */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-20 lg:gap-32">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-5">
                <h3 className="text-[#5C53FE] font-semibold text-sm">{category}</h3>
                <ul className="flex flex-col gap-4">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mt-16 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                  social.active
                    ? "bg-[#5C53FE] text-white hover:bg-[#4a42e8]"
                    : "bg-[#222222] text-gray-300 hover:bg-[#2e2e2e]"
                }`}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright + Legal */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-gray-400 text-sm">
            <span>Copyright 2024 —HireLoop</span>
            <Link href="/terms" className="hover:text-white transition-colors duration-200">
              Terms &amp; Policy - Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}