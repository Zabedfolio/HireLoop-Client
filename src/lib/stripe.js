import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
    'seeker_free' : 'price_1TjdENDF0WNHPLbp8p6cco2P',
    'seeker_pro' : 'price_1Tjd4kDF0WNHPLbpY72YWlIS',
    'seeker_premium' : 'price_1TjdF5DF0WNHPLbpdj7TIdmD',
    'recruiter_free' : 'price_1TjdFjDF0WNHPLbprFkdAiaZ',
    'recruiter_growth' : 'price_1TjdGKDF0WNHPLbp2XNZWJAx',
    'recruiter_enterprise' : 'price_1TjdHBDF0WNHPLbpRfgIfQt3'
}