import express from "express";
import { ENV } from "./config/env.js";
import userRoutes from "./routes/userRoutes.js"
import accountRoutes from "./routes/accountRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import premiumRoutes from "./routes/premiumRoutes.js"
import chatbotRoutes from "./routes/chatbotRoutes.js"
import paymentRoute from "./routes/paymentRoutes.js"

import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use("/api/payment", (req, res, next) => {
    console.log(req.originalUrl);

    if (req.originalUrl === "/api/payment/webhook") {
        express.raw({ type: "application/json" })(req, res, next)
    } else {
        express.json()(req, res, next) // parse json for non-webhook routes
    }
}, paymentRoute)

app.use(express.json())
app.use(clerkMiddleware()) //add auth object under the req => req.auth

app.use("/api/user", userRoutes)
app.use("/api/account", accountRoutes)
app.use("/api/transaction", transactionRoutes)
app.use("/api/premium", premiumRoutes)
app.use("/api/chatbot", chatbotRoutes)

app.listen(ENV.PORT, () => {
    console.log(`Server is running on ${ENV.PORT}`);

})