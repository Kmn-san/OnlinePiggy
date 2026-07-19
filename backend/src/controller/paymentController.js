import Stripe from "stripe"
import { ENV } from "../config/env.js"
import * as userService from "../service/userService.js"

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY)

export const createPaymentIntent = async (req, res) => {
    try {
        const user = req.user
        const userExist = await userService.findByUserId(user.id)
        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }

        let customerId = user.stripe_custemor_id;
        let customer;
        if (customerId) {
            customer = await stripe.customers.retrieve(customerId)
        } else {
            customer = await stripe.customers.create({
                name: user.username,
                metadata: {
                    clerkId: user.clerkid,
                    userId: user.id
                }
            })
            customerId = customer.id;
            await userService.addStripeId(user.id, customerId)
        }

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [
                {
                    price: ENV.STRIPE_PREMIUM_PRICE_ID,
                },
            ],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.confirmation_secret'],
            metadata: {
                clerkId: user.clerkid,
                userId: user.id,
                paymentDate: new Date().toISOString()
            }
        });

        const clientSecret = subscription.latest_invoice?.confirmation_secret?.client_secret;

        if (!clientSecret) {
            throw new Error("Could not retrieve confirmation client secret from Stripe.");
        }

        res.status(200).json({ subscriptionId: subscription.id, clientSecret: clientSecret })

    } catch (error) {
        console.log("Error creating payment intent: ", error.message);
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export const handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let event

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        console.error("Webhook signature verification failed: ", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`)
    }

    switch (event.type) {
        // Sent every month when their card is successfully charged
        case "payment_intent.succeeded": {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;

            // Retrieve subscription to read the metadata you passed during setup
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const { userId } = subscription.metadata;

            if (userId) {
                // Update premium status to true
                await userService.setPremium(userId, true);
                console.log(`User ${userId} subscription renewed successfully.`);
            }
            break;
        }

        // Sent if their monthly charge fails (e.g., card expired, insufficient funds)
        case "invoice.payment_failed": {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const { userId } = subscription.metadata;

            if (userId) {
                // Turn off premium status
                await userService.setPremium(userId, false);
                console.log(`User ${userId} payment failed. Premium access revoked.`);
            }
            break;
        }

        // Sent when they cancel their subscription or if it expires completely
        case "customer.subscription.deleted": {
            const subscription = event.data.object;
            const { userId } = subscription.metadata;

            if (userId) {
                await userService.setPremium(userId, false);
                console.log(`Subscription deleted. Revoked premium for user ${userId}`);
            }
            break;
        }
    }
    res.json({ received: true })
}

export const checkStatus = async (req, res) => {
    const userId = req.user.id
    const userExist = await userService.findByUserId(userId);
    res.json({ is_premium: userExist ? userExist.is_premium : false });
} 