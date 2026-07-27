import * as chatService from "../service/chatService.js"
import * as messageService from "../service/messageService.js"

export const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;

        const chat = await chatService.getChatsWithChatId(userId, chatId)

        if (!chat) {
            return res.status(404).json({ code: "NO_CHAT_FOUND" })
        }

        const messages = await messageService.findMessages(chatId)

        res.json(messages)

    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
        });
    }
}