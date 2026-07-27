import * as userService from "../service/userService.js"
import * as chatService from "../service/chatService.js"

const isValidUUID = (uuid) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

export const getChats = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ code: "UNAUTHORIZED" })
        }

        const chats = await chatService.getChats(userId)

        // Remove self and format response
        const formattedChats = chats.map((chat) => {
            const otherParticipant = chat.other_user_id ? {
                id: chat.other_user_id,
                username: chat.other_username,
                avatar_url: chat.other_avatar_url,
                opid: chat.other_opid
            } : null;
            const lastMessage = chat.last_message_id ? {
                id: chat.last_message_id,
                message_text: chat.message_text
            } : null;

            return {
                _id: chat.room_id,
                is_group: chat.is_group,
                participant: otherParticipant,
                lastMessage: lastMessage,
                lastMessageAt: chat.last_message_at || chat.room_created_at,
                createdAt: chat.room_created_at
            }
        })
        res.json(formattedChats)
    } catch (error) {
        console.error("Error in getChats controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}

export const getOrCreateChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { participantId } = req.params;

        if (!userId) {
            return res.status(401).json({ code: "UNAUTHORIZED" })
        }

        if (!participantId) {
            return res.status(401).json({ code: "PARTICIPANT_ID_MISSING" })
        }

        if (!isValidUUID(participantId)) {
            res.status(400).json({ message: "INVALID_PARTICIPANT_ID" });
            return;
        }

        if (participantId === userId) {
            res.status(400).json({ message: "SAME_USER" });
            return;
        }

        const participant = await userService.findByUserId(participantId)
        if (!participant) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }

        //Check if chat exists
        let chat = await chatService.existingChatQuery(userId, participantId)
        let chatRoom;
        let lastMessage = null;

        if (!chat) {
            chatRoom = await chatService.createChat(userId, participantId)
        } else {
            chatRoom = {
                id: chat.room_id,
                created_at: chat.created_at
            };

            // Only assign lastMessage if there actually is one
            if (chat.last_message_id) {
                lastMessage = {
                    id: chat.last_message_id,
                    message_text: chat.message_text,
                    created_at: chat.last_message_at,
                };
            }
        }
        res.json({
            _id: chatRoom.id,
            participant: {
                id: participant.id,
                username: participant.username,
                avatar_url: participant.avatar_url,
                opid: participant.opid,
            },
            lastMessage: lastMessage ? {
                id: lastMessage.id,
                message_text: lastMessage.message_text,
            } : null,
            lastMessageAt: lastMessage ? lastMessage.created_at : chatRoom.created_at,
            createdAt: chatRoom.created_at,
        });

    } catch (error) {
        console.error("Error in getOrCreateChat controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}