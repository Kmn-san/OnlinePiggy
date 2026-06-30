import { clerkClient, requireAuth } from "@clerk/express"
import * as userService from "../service/userService.js"

export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {

        try {
            const clerkId = req.auth().userId
            if (!clerkId) return res.status(401).json({ code: "UNAUTHORIZED" })
            let user = await userService.findByClerkId(clerkId)
            if (!user) {
                const clerkUser =
                    await clerkClient.users.getUser(clerkId);// this will return all the data from the account

                user =
                    await userService.createUserFromClerk({
                        clerkId: clerkUser.id,
                        username:
                            clerkUser.username ||
                            clerkUser.firstName ||
                            "New User",
                        avatar_url:
                            clerkUser.imageUrl
                    });
            }
            req.user = user;
            req.clerkId = clerkId;
            next()
        } catch (error) {
            console.error("Error in protectRoute middleware: ", error.message);
            res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
        }
    }
]