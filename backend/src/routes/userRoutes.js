import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { profilePicUpload } from "../middleware/multer.js";
import { changeCurrency, getUser, recoverUser, softDeleteUser, updateProfilePic, updateUser } from "../controller/userController.js";
const router = Router()

router.use(protectRoute);

router.get("/me", getUser)
router.patch("/me", updateUser)
router.patch("/currency", changeCurrency)
router.patch("/avatar", profilePicUpload, updateProfilePic)
router.delete("/remove-user", softDeleteUser)
router.patch("/recover-user", recoverUser)

export default router