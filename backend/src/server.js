import express from "express";
import { ENV } from "./config/env.js";
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import accountRoutes from "./routes/accountRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import premiumRoutes from "./routes/premiumRoutes.js"

import aiRoutes from "./routes/aiRoutes.js"

import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(express.json())
app.use(clerkMiddleware()) //add auth object under the req => req.auth
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true })) // credentials : true allows 

app.use("/api/user", userRoutes)
app.use("/api/account", accountRoutes)
app.use("/api/transaction", transactionRoutes)
app.use("/api/premium", premiumRoutes)
app.use("/api/ai", aiRoutes)

app.listen(ENV.PORT, () => {
    console.log(`Server is running on ${ENV.PORT}`);

})