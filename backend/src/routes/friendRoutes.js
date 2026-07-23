import { Router } from "express";
import { findFriend, getAllRequest, getFriends, respondToFriendRequest, sendFriendRequest } from "../controller/friendController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
const router = Router()
router.use(protectRoute)

router.get("/friends", getFriends)
router.get("/all-requests", getAllRequest)
router.post("/requests", sendFriendRequest)
router.patch("/requests/:requestId", respondToFriendRequest)
router.patch("/findFriend/:opid", findFriend)

export default router