import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { profilePicUpload } from "../middleware/multer.js";
import { changeCurrency, getUser, updateProfilePic, updateUser } from "../controller/userController.js";
const router = Router()

router.use(protectRoute); // make sure user had login

router.get("/me",getUser)
router.patch("/me",updateUser)
router.patch("/currency",changeCurrency)
router.patch("/avatar",profilePicUpload,updateProfilePic)


export default router