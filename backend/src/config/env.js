import dotenv from "dotenv";
dotenv.config({ quiet: true })

export const ENV = {
    PORT: process.env.PORT || 3000,

    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PREMIUM_PRICE_ID: process.env.STRIPE_PREMIUM_PRICE_ID,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    FRONTEND_URL: process.env.FRONTEND_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY
}
