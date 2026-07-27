import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getChats, getOrCreateChat } from "../controller/chatController.js";

const router = Router()
router.use(protectRoute)

router.get("/", getChats)
router.post("/with/:participantId", getOrCreateChat)
// router.post("/with/chatbot")


export default router