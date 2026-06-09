'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { signUp } from '@/lib/auth-client';
import { Briefcase, Person, Lock, Eye, EyeSlash, At, Camera } from '@gravity-ui/icons';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Radio, RadioGroup } from "@heroui/react";

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

function Field({ label, icon: Icon, endIcon, type = 'text', placeholder, name, value, onChange, required }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-white/60 text-sm">{label}</label>
            <div className="flex items-center gap-3 h-12 px-3 rounded-xl border border-white/10 bg-white/[0.04] hover:border-white/20 focus-within:border-[#5B4DFF] focus-within:bg-white/[0.06] transition-all duration-200">
                {Icon && <Icon className="shrink-0 text-white/30 w-4 h-4" />}
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

const ease = [0.22, 1, 0.36, 1];

const stars = [
    'top-10 left-8 sm:left-20',
    'top-24 left-1/3',
    'top-16 right-8 sm:right-32',
    'top-56 left-1/4',
    'top-80 left-4 sm:left-16',
    'top-1/2 right-12',
    'bottom-32 left-1/3',
    'bottom-16 right-1/4',
];

const statCards = [
    { value: '12K+', label: 'Active Jobs' },
    { value: '8K+', label: 'Companies' },
    { value: '25K+', label: 'Hired' },
];

const fieldVariant = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const roles = [
    { value: 'job_seeker', label: 'Job Seeker' },
    { value: 'recruiter', label: 'Recruiter' },
];

export default function SignUpPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        role: 'job_seeker',
        email: '',
        image: '',
        password: '',
        confirmPassword: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    if (formData.password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }

    const normalizedEmail = formData.email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
        alert('Please enter a valid email address');
        return;
    }

    try {
        setLoading(true);
        const result = await signUp.email({
            email: normalizedEmail,
            password: formData.password,
            name: formData.name,
            role: formData.role,
            image: formData.image,
            callbackURL: '/',
        });

        if (result?.error) {
            const message = result.error.message?.toLowerCase() || '';
            if (message.includes('already') || message.includes('exist') || message.includes('duplicate') || message.includes('taken')) {
                toast.error('An account with this email already exists');
            } else if (message.includes('invalid') && message.includes('email')) {
                toast.error('Please enter a valid email address');
            } else {
                toast.error(result.error.message || 'Signup failed');
            }
            return;
        }

        toast.success('Account created successfully');
    } catch (error) {
        console.error(error);
        const message = error?.message?.toLowerCase() || '';
        if (message.includes('already') || message.includes('exist') || message.includes('duplicate') || message.includes('taken')) {
            toast.error('An account with this email already exists');
        } else if (message.includes('invalid') && message.includes('email')) {
            toast.error('Please enter a valid email address');
        } else {
            toast.error(error?.message || 'Signup failed');
        }
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
                {stars.map((pos, i) => (
                    <motion.div
                        key={i}
                        className={`absolute h-px w-px rounded-full bg-white sm:h-1 sm:w-1 ${pos}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
                    />
                ))}
            </div>

            {/* Globe */}
            <motion.div
                className="absolute -top-50 left-1/2 -translate-x-1/2 w-[260%] xs:w-[220%] sm:w-[160%] md:w-[110%] lg:w-full max-w-none pointer-events-none"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{ duration: 1.6, ease }}
            >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #000 0%, transparent 50%)' }} />
                <Image src="/images/globe.png" alt="Globe" width={1400} height={700} className="w-full object-contain" style={{ height: 'auto' }} priority />
            </motion.div>

            {/* Ambient glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5B4DFF]/[0.08] blur-[140px] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2 }}
            />

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">

                {/* LEFT SIDE */}
                <motion.div
                    className="hidden lg:flex flex-col justify-center"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
                    }}
                >
                    <motion.div
                        className="inline-flex w-fit items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2 rounded-full backdrop-blur-xl mb-6"
                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
                    >
                        <Briefcase width={14} height={14} className="text-white" />
                        <span className="text-white text-sm font-medium">HireLoop</span>
                    </motion.div>

                    <motion.h1
                        className="text-5xl font-semibold text-white leading-tight"
                        variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
                    >
                        Build your <br />career with <br />confidence.
                    </motion.h1>

                    <motion.p
                        className="text-white/50 mt-6 text-lg leading-relaxed max-w-lg"
                        variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } }}
                    >
                        Join thousands of professionals discovering new opportunities,
                        building connections, and landing dream jobs through HireLoop.
                    </motion.p>

                    <motion.div
                        className="grid grid-cols-3 gap-4 mt-10 max-w-lg"
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
                    >
                        {statCards.map((stat, i) => (
                            <motion.div
                                key={i}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5"
                                variants={{
                                    hidden: { opacity: 0, y: 20, scale: 0.96 },
                                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease } },
                                }}
                                whileHover={{ y: -4, borderColor: 'rgba(91,77,255,0.35)', transition: { duration: 0.25 } }}
                            >
                                <h3 className="text-2xl font-semibold text-white">{stat.value}</h3>
                                <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    className="w-full max-w-md mx-auto"
                    initial={{ opacity: 0, y: 36, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.8, ease }}
                >
                    {/* Mobile Header */}
                    <motion.div
                        className="text-center mb-6 lg:hidden"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease }}
                    >
                        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2 rounded-full backdrop-blur-xl">
                            <Briefcase width={14} height={14} className="text-white" />
                            <span className="text-white text-sm font-medium">HireLoop</span>
                        </div>
                        <h1 className="text-3xl font-semibold text-white mt-5">Create account</h1>
                        <p className="text-white/50 text-sm mt-2">Join thousands of job seekers</p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8"
                        whileHover={{ borderColor: 'rgba(91,77,255,0.2)', transition: { duration: 0.4 } }}
                    >
                        {/* Desktop Heading */}
                        <motion.div
                            className="hidden lg:block mb-6"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.55, ease }}
                        >
                            <h2 className="text-3xl font-semibold text-white">Create account</h2>
                            <p className="text-white/50 text-sm mt-2">Start your professional journey today</p>
                        </motion.div>

                        {/* Google Button */}
                        <motion.button
                            type="button"
                            className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 flex items-center justify-center gap-2 text-sm mb-5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.52, duration: 0.5, ease }}
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <GoogleIcon />
                            Continue with Google
                        </motion.button>

                        {/* Divider */}
                        <motion.div
                            className="flex items-center gap-3 mb-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.58, duration: 0.5 }}
                        >
                            <div className="h-px bg-white/10 flex-1" />
                            <span className="text-xs text-white/30">or</span>
                            <div className="h-px bg-white/10 flex-1" />
                        </motion.div>

                        {/* Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.62 } },
                            }}
                        >
                            <motion.div variants={fieldVariant}>
                                <Field
                                    label="Full Name"
                                    icon={Person}
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </motion.div>

                            {/* Role Selection — custom toggle, no HeroUI internals */}
                            <motion.div variants={fieldVariant}>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-sm">I am a</label>
                                    <div className="flex gap-3">
                                        {roles.map(({ value, label }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, role: value }))}
                                                className={[
                                                    'flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-200',
                                                    formData.role === value
                                                        ? 'border-[#5B4DFF] bg-[#5B4DFF]/10 text-white'
                                                        : 'border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white/80',
                                                ].join(' ')}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={fieldVariant}>
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
                            </motion.div>

                            <motion.div variants={fieldVariant}>
                                <Field
                                    label="Profile Image URL"
                                    icon={Camera}
                                    name="image"
                                    type="url"
                                    placeholder="https://..."
                                    value={formData.image}
                                    onChange={handleChange}
                                />
                            </motion.div>

                            <motion.div variants={fieldVariant}>
                                <Field
                                    label="Password"
                                    icon={Lock}
                                    name="password"
                                    type={isVisible ? 'text' : 'password'}
                                    placeholder="Min 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    endIcon={
                                        <button type="button" onClick={() => setIsVisible(!isVisible)} className="shrink-0">
                                            {isVisible
                                                ? <EyeSlash className="text-white/30 w-4 h-4" />
                                                : <Eye className="text-white/30 w-4 h-4" />
                                            }
                                        </button>
                                    }
                                />
                            </motion.div>

                            <motion.div variants={fieldVariant}>
                                <Field
                                    label="Confirm Password"
                                    icon={Lock}
                                    name="confirmPassword"
                                    type={isConfirmVisible ? 'text' : 'password'}
                                    placeholder="Repeat password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    endIcon={
                                        <button type="button" onClick={() => setIsConfirmVisible(!isConfirmVisible)} className="shrink-0">
                                            {isConfirmVisible
                                                ? <EyeSlash className="text-white/30 w-4 h-4" />
                                                : <Eye className="text-white/30 w-4 h-4" />
                                            }
                                        </button>
                                    }
                                />
                            </motion.div>

                            {/* Terms checkbox */}
                            <motion.label
                                className="flex items-center gap-2.5 cursor-pointer select-none"
                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
                            >
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="w-4 h-4 rounded border border-white/20 bg-white/[0.04] accent-[#5B4DFF] cursor-pointer"
                                />
                                <span className="text-xs text-white/50 leading-relaxed">
                                    I agree to Terms & Privacy Policy
                                </span>
                            </motion.label>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={!agreed || loading}
                                className="w-full h-12 bg-[#5B4DFF] text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                                whileHover={agreed && !loading ? { backgroundColor: '#6D5FFF', scale: 1.02, transition: { duration: 0.2 } } : {}}
                                whileTap={agreed && !loading ? { scale: 0.98 } : {}}
                            >
                                {loading && (
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                )}
                                Create Account
                            </motion.button>
                        </motion.form>

                        {/* Footer */}
                        <motion.p
                            className="text-center text-xs text-white/40 mt-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        >
                            Already have an account?{' '}
                            <Link href="/signin" className="text-[#7B6FFF] hover:text-[#9B8FFF] transition-colors">
                                Sign in
                            </Link>
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}