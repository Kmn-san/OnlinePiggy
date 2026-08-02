import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { aiChat } from "../controller/aiController.js";

const router = express.Router()

router.post("/chat", protectRoute, aiChat)

export default router