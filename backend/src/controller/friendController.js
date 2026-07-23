import * as userService from "../service/userService.js"
import * as friendService from "../service/friendService.js"

export const getFriends = async (req, res) => {
    try {
        const userId = req.user.id;

        const userExist = await userService.findByUserId(userId)

        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }

        const result = await friendService.friendList(userId)
        return res.status(200).json(result)


    } catch (error) {
        console.error("Error in getFriend controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}

export const getAllRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const userExist = await userService.findByUserId(userId)

        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }

        const result = await friendService.allRequest(userId)

        return res.status(200).json(result)

    } catch (error) {
        console.error("Error in getAllReqeust controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id
        const { friendId } = req.body;

        if (userId === friendId) {
            return res.status(201).json({ code: "SAME_USER" })
        }
        const userExist = await userService.findByUserId(userId)

        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }

        const realtionship = await friendService.friendRealtion(userId, friendId)
        if (realtionship) {
            if (realtionship.request_status === "accepted") {
                return res.status(200).json({ code: "ALREADY_FRIEND" })
            }
            if (relationship.request_status === "pending") {
                return res.status(400).json({ code: "REQUEST_ALREADY_PENDING" });
            }
        }
        const sendRequest = await friendService.sendRequest(userId, friendId)

        return res.status(200).json(sendRequest)

    } catch (error) {
        console.error("Error in sendFriendRequest controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}

export const respondToFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params
        const userId = req.user.id
        const { respondRequest } = req.body

        if (respondRequest !== 'accepted' && respondRequest !== 'rejected') {
            return res.status(401).json({ code: "WRONG_DATA_SENT" })
        }
        const userExist = await userService.findByUserId(userId)

        const realtionshipExist = await friendService.existRelation(userExist.id, requestId)

        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }
        if (!realtionshipExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }
        if (userExist.id === realtionshipExist.sender_id) {
            return res.status(404).json({ code: "SAME_USER" })
        }

        const respond = await friendService.responseToRequest(userExist.id, realtionshipExist.id, respondRequest)

        return res.status(200).json(respond)

    } catch (error) {
        console.error("Error in respondToFriendRequest controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}

export const findFriend = async (req, res) => {
    try {
        const { opid } = req.params;
        const userId = req.user.id

        const userExist = await userService.findByUserId(userId)

        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }

        const existOpid = await userService.existedOpid(opid)
        if (!existOpid) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }

        const result = await userService.findByUserId(existOpid.id)
        if (result.id === userExist.id) {
            return res.status(401).json({ code: "SAME_USER" })
        }
        return res.status(200).json(result)

    } catch (error) {
        console.error("Error in findFriend controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}