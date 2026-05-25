'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import {
    Briefcase,
    Lock,
    Eye,
    EyeSlash,
    At,
} from '@gravity-ui/icons';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

// Reusable Field Component
function Field({
    label,
    icon: Icon,
    endIcon,
    type = 'text',
    placeholder,
    name,
    value,
    onChange,
    required,
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-white/60 text-sm">
                {label}
            </label>

            <div className="flex items-center gap-3 h-12 px-3 rounded-xl border border-white/10 bg-white/[0.04] hover:border-white/20 focus-within:border-[#5B4DFF] focus-within:bg-white/[0.06] transition-all duration-200">
                {Icon && (
                    <Icon className="shrink-0 text-white/30 w-4 h-4" />
                )}

                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
                />

                {endIcon}
            </div>
        </div>
    );
}

export default function SignInPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await signIn.email({
                email: formData.email,
                password: formData.password,
                callbackURL: '/',
            });

            alert('Login successful');
        } catch (error) {
            console.error(error);
            alert(error?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-black px-4 py-12 overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B1F] via-black to-black" />

            {/* Stars */}
            <div className="absolute inset-0 opacity-70 pointer-events-none">
                <div className="absolute top-10 left-8 h-px w-px rounded-full bg-white sm:left-20 sm:h-1 sm:w-1" />
                <div className="absolute top-24 left-1/3 h-px w-px rounded-full bg-white sm:h-1 sm:w-1" />
                <div className="absolute top-16 right-8 h-px w-px rounded-full bg-white sm:right-32 sm:h-1 sm:w-1" />
                <div className="absolute top-56 left-1/4 h-px w-px rounded-full bg-white sm:h-1 sm:w-1" />
                <div className="absolute top-80 left-4 h-px w-px rounded-full bg-white sm:left-16 sm:h-1 sm:w-1" />
                <div className="absolute top-1/2 right-12 h-px w-px rounded-full bg-white sm:h-1 sm:w-1" />
                <div className="absolute bottom-32 left-1/3 h-px w-px rounded-full bg-white sm:h-1 sm:w-1" />
                <div className="absolute bottom-16 right-1/4 h-px w-px rounded-full bg-white sm:h-1 sm:w-1" />
            </div>

            {/* Globe */}
            <div className="absolute -top-50 left-1/2 -translate-x-1/2 w-[260%] xs:w-[220%] sm:w-[160%] md:w-[110%] lg:w-full max-w-none opacity-40 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to bottom, #000 0%, transparent 50%)',
                    }}
                />

                <Image
                    src="/images/globe.png"
                    alt="Globe"
                    width={1400}
                    height={700}
                    className="w-full object-contain"
                    style={{ height: 'auto' }}
                    priority
                />
            </div>

            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5B4DFF]/[0.08] blur-[140px] pointer-events-none" />

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">

                {/* LEFT SIDE */}
                <div className="hidden lg:flex flex-col justify-center">

                    <div className="inline-flex w-fit items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2 rounded-full backdrop-blur-xl mb-6">
                        <Briefcase
                            width={14}
                            height={14}
                            className="text-white"
                        />

                        <span className="text-white text-sm font-medium">
                            HireLoop
                        </span>
                    </div>

                    <h1 className="text-5xl font-semibold text-white leading-tight">
                        Welcome <br />
                        back to your <br />
                        workspace.
                    </h1>

                    <p className="text-white/50 mt-6 text-lg leading-relaxed max-w-lg">
                        Access your dashboard, manage applications,
                        connect with recruiters, and continue building
                        your professional future with HireLoop.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
                            <h3 className="text-2xl font-semibold text-white">
                                12K+
                            </h3>

                            <p className="text-sm text-white/50 mt-1">
                                Open Jobs
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
                            <h3 className="text-2xl font-semibold text-white">
                                8K+
                            </h3>

                            <p className="text-sm text-white/50 mt-1">
                                Recruiters
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
                            <h3 className="text-2xl font-semibold text-white">
                                25K+
                            </h3>

                            <p className="text-sm text-white/50 mt-1">
                                Success Stories
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="w-full max-w-md mx-auto">

                    {/* Mobile Header */}
                    <div className="text-center mb-6 lg:hidden">
                        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2 rounded-full backdrop-blur-xl">
                            <Briefcase
                                width={14}
                                height={14}
                                className="text-white"
                            />

                            <span className="text-white text-sm font-medium">
                                HireLoop
                            </span>
                        </div>

                        <h1 className="text-3xl font-semibold text-white mt-5">
                            Welcome back
                        </h1>

                        <p className="text-white/50 text-sm mt-2">
                            Sign in to continue your journey
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8">

                        {/* Desktop Heading */}
                        <div className="hidden lg:block mb-6">
                            <h2 className="text-3xl font-semibold text-white">
                                Welcome back
                            </h2>

                            <p className="text-white/50 text-sm mt-2">
                                Sign in to access your account
                            </p>
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08] flex items-center justify-center gap-2 text-sm transition-all duration-200 mb-5"
                        >
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-px bg-white/10 flex-1" />
                            <span className="text-xs text-white/30">
                                or
                            </span>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            <Field
                                label="Email Address"
                                icon={At}
                                name="email"
                                type="email"
                                placeholder="john@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <Field
                                label="Password"
                                icon={Lock}
                                name="password"
                                type={isVisible ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                endIcon={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsVisible(!isVisible)
                                        }
                                        className="shrink-0"
                                    >
                                        {isVisible ? (
                                            <EyeSlash className="text-white/30 w-4 h-4" />
                                        ) : (
                                            <Eye className="text-white/30 w-4 h-4" />
                                        )}
                                    </button>
                                }
                            />

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-[#7B6FFF] hover:text-[#9B8FFF] transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-[#5B4DFF] text-white rounded-xl font-semibold hover:bg-[#6D5FFF] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <svg
                                        className="animate-spin w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />

                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>
                                )}

                                Sign In
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-xs text-white/40 mt-5">
                            Don&apos;t have an account?{' '}

                            <Link
                                href="/signup"
                                className="text-[#7B6FFF] hover:text-[#9B8FFF] transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}