import * as userService from "../service/userService.js"
import cloudinary from "../utlis/cloudinary.js"

export const getUser = async (req, res) => {
    try {
        const clerkId = req.clerkId;

        const clientData = await userService.userData(clerkId);
        if (!clientData) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }
        return res.status(200).json(clientData)
    } catch (error) {
        console.error("Error in getUser controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const clerkId = req.clerkId;
        const clientData = req.body;
        
        if (!Object.keys(clientData).length) {
            return res.status(400).json({ code: "NO_DATA_PROVIDED" })
        }//if no data given

        if (clientData.opid) {
            const Opid = clientData.opid
            const user = await userService.userData(clerkId)

            if (user.opid_updated_at) {
                const lastChanged = new Date(user.opid_updated_at);
                const now = new Date();

                const daysPassed = (now - lastChanged) / (1000 * 60 * 60 * 24)

                if (daysPassed < 30) {
                    return res.status(403).json({ code: "OPID_CHANGE_COOLDOWN", daysRemaining: (30 - daysPassed) })
                }
            }
            const existingOpid = await userService.existedOpid(Opid, clerkId)
            if (existingOpid) {
                return res.status(409).json({
                    code: "OPID_ALREADY_EXISTS"
                })
            }
        }// is the opid exist or not

        const result = await userService.updateData(clientData, clerkId)
        if (!result) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }
        return res.status(200).json({ code: "UPDATE_SUCCESS", result })
    } catch (error) {
        console.error("Error in updateUser controller: ", error.message);
        if (error.message === "NO_VALID_FIELDS") {
            return res.status(400).json({
                code: "NO_VALID_FIELDS"
            })
        }
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}

export const updateProfilePic = async (req, res) => {
    try {
        const clerkId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ code: "NO_FILE_UPLOAD" })
        }
        const user = await userService.userData(clerkId)
        const oldPublicId = user.avatar_public_id;
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "onlinepiggy_profilePic" }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
            stream.end(req.file.buffer)
        })
        const imageUrl = uploadResult.secure_url;
        const newPublicId = uploadResult.public_id

        await userService.changeProfilePic(imageUrl, newPublicId, clerkId)

        if (oldPublicId) {
            await cloudinary.uploader.destroy(oldPublicId)
        }

        return res.status(200).json({ code: "PROFILEPIC_UPDATE_SUCCESS", url: imageUrl })
    } catch (error) {
        console.error("Error in updateProfilePic controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}

