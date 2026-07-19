import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js"
import { checkStatus, createPaymentIntent, handleWebhook } from "../controller/paymentController.js";

const router = Router()

router.post("/create-intent", protectRoute, createPaymentIntent)

router.post("/webhook", handleWebhook)
router.get("/status", protectRoute, checkStatus);

export default router