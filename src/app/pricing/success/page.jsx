import Link from 'next/link'
import { BsCheck, BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details: { email: customerEmail },
    line_items,
    amount_total,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  if (status === 'open') return redirect('/')

  if (status === 'complete') {
    const planName = line_items?.data?.[0]?.description ?? 'Your Plan'
    const amount = amount_total ? `$${(amount_total / 100).toFixed(2)}` : null

    return (
      <section className="relative min-h-screen overflow-hidden bg-[#090909] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1B1440_0%,#090909_55%,#000_100%)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[300px] bg-[#6D5FFF]/[0.12] blur-[120px] rounded-full" />
        <div className="absolute top-[10%] left-[12%] w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_18px_5px_rgba(255,255,255,0.3)]" />
        <div className="absolute top-[18%] right-[10%] w-1.5 h-1.5 rounded-full bg-[#6D5FFF] shadow-[0_0_22px_7px_rgba(109,95,255,0.5)]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full py-20">

          {/* Check icon */}
          <div className="w-20 h-20 rounded-full bg-[#5B4DFF]/15 border border-[#5B4DFF]/40 flex items-center justify-center mb-6 shadow-[0_0_0_0_rgba(91,77,255,0.3)] animate-pulse">
            <BsCheck className="w-9 h-9 text-[#a59fff]" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#5B4DFF]/10 border border-[#5B4DFF]/20 rounded-full px-3.5 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4DFF] inline-block" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#a59fff]/90 font-medium">
              Payment Confirmed
            </span>
          </div>

          <h1 className="text-3xl font-semibold text-white tracking-tight mb-3">
            You're all set!
          </h1>
          <p className="text-white/45 text-[14px] leading-7 mb-8 max-w-sm">
            Your subscription is active. A confirmation has been sent to{' '}
            <span className="text-[#a59fff] font-medium">{customerEmail}</span>
          </p>

          {/* Order summary */}
          <div className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-2xl px-6 py-5 mb-7 text-left">
            {[
              { label: 'Plan', value: planName },
              { label: 'Billing', value: 'Monthly' },
              ...(amount ? [{ label: 'Amount', value: `${amount} / month` }] : []),
              { label: 'Status', value: 'active', isStatus: true },
            ].map(({ label, value, isStatus }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
                <span className="text-xs text-white/40">{label}</span>
                {isStatus ? (
                  <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2.5 py-0.5 font-medium capitalize">
                    {value}
                  </span>
                ) : (
                  <span className="text-sm text-white/85 font-medium">{value}</span>
                )}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 w-full">
            <Link
              href="/dashboard"
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#5B4DFF] text-sm font-medium text-white hover:bg-[#6D5FFF] hover:scale-[1.01] transition-all duration-300"
            >
              Go to Dashboard
              <BsArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/"
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] text-sm font-medium text-white/70 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
            >
              <BsArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>

          <p className="text-xs text-white/25 mt-6 leading-6">
            Questions? Email{' '}
            <a href="mailto:support@hireloop.com" className="text-[#a59fff]/70 hover:underline">
              support@hireloop.com
            </a>
          </p>
        </div>
      </section>
    )
  }
}