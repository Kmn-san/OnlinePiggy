import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { createTransaction, getTransaction } from "../controller/transactionController.js";

const router = Router()
router.use(protectRoute)

router.get("/getTransaction", getTransaction)
router.patch("/createTransaction", createTransaction)

export default router