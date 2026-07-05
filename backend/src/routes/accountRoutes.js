import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { addAccount, addGoalAccount, deleteGoalAccount, getAccount } from "../controller/accountController.js";
const router = Router()

router.use(protectRoute)

router.get("/getAccounts", getAccount)
router.patch("/goalAccounts", addGoalAccount) // add goal
router.patch("/addAccounts", addAccount) // add new account
router.delete("/goalAccount", deleteGoalAccount) // delete goal


export default router