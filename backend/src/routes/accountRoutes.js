import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { addAccount, addGoalAccount, deleteGoalAccount, getAccount } from "../controller/accountController.js";
const router = Router()

router.use(protectRoute)

router.get("/accounts", getAccount)
router.patch("/goal-accounts", addGoalAccount) // add goal
router.patch("/add-accounts", addAccount) // add new account
router.delete("/goal-account", deleteGoalAccount) // delete goal


export default router