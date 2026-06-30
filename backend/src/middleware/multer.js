import multer from "multer";

const storage = multer.memoryStorage();

export const profilePicUpload = multer({storage}).single("profilePic")