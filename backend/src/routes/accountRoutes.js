import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getAccount } from "../controller/accountController.js";
const router = Router()

router.use(protectRoute)

// router.get("/accounts", getAccount)
// router.patch("/accounts") // add goal
// router.delete("/goal-account") // delete goal


export default router