import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getTransaction } from "../controller/transactionController.js";

const router = Router()
router.use(protectRoute)

router.get("/transaction", getTransaction)
// router.patch("/transaction", createTransaction)
// router.patch("/edit-transaction", editTransaction)

export default router