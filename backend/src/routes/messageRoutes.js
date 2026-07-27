import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getMessages } from "../controller/messagesController.js";

const router = Router()

router.get("/chat/:chatId", protectRoute, getMessages)

export default router