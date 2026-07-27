import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io"
import { verifyToken } from "@clerk/express";
import { ENV } from "../config/env.js";
import * as userService from "../service/userService.js"
import * as chatService from "../service/chatService.js"
import * as messageService from "../service/messageService.js"

export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {

    const allowedOrigins = [
        "http://localhost:8081",
        ENV.FRONTEND_URL,
    ].filter(Boolean) as string[];

    const io = new SocketServer(httpServer, { cors: { origin: allowedOrigins } })

    // verify socket connection - if the user is authenticated, we will store the user id in the socket
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token; // this is what user will send from client

        if (!token) return next(new Error("Authentication error"))
        try {
            const session = await verifyToken(token, { secretKey: ENV.CLERK_SECRET_KEY! })

            const clerkId = session.sub
            const user = await userService.findByClerkId(clerkId)

            if (!user) return next(new Error("User not found"))

            socket.data.userId = user.id

            next()
        } catch (error: any) {
            next(new Error(error))
        }
    })

    // it's the event that is triggered when a new client connects to the server
    io.on("connection", (socket) => {
        const userId = socket.data.userId

        // send list of currently online users to the newly connected user
        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) })

        // store user in the onlineUsers map 
        onlineUsers.set(userId, socket.id)

        // notify others that this current user is online
        socket.broadcast.emit("user-online", { userId })

        socket.join(`user:${userId}`);

        socket.on("join-chat", (chatId: string) => {
            socket.join(`chat:${chatId}`)
        })

        socket.on("leave-chat", (chatId: string) => {
            socket.leave(`chat:${chatId}`)
        })

        // handle sending messages
        socket.on("send-message", async (data: { chatId: string, text: string }) => {
            try {
                const { chatId, text } = data
                const chat = await chatService.getChatsWithChatId(userId, chatId)

                if (!chat) {
                    socket.emit("socket-error", { message: "Chat not found or unauthorized " });
                    return
                }

                const message = await messageService.createMessage(chatId, userId, text)

                io.to(`chat:${chatId}`).emit("new-message", message)

                const participants = await chatService.getChatParticipants(chatId)

                for (const participantId of participants) {
                    io.to(`user:${participantId}`).emit("new-message", message)
                }
            } catch (error) {
                socket.emit("socket-error", { message: "Failed to send message" })
            }
        })

        socket.on("typing", async (data: { chatId: string, isTyping: boolean }) => {
            const typingPayload = {
                userId,
                chatId: data.chatId,
                isTyping: data.isTyping
            }

            //emit to chat room (for users inside the chat)
            socket.to(`chat:${data.chatId}`).emit("typing", typingPayload)

            //also emit to other participants personal room (for chat list view)
            try {
                const participants = await chatService.getChatParticipants(data.chatId)
                if (participants && participants.length > 0) {
                    const otherParticipants = participants.filter(id => id !== userId)

                    for (const otherId of otherParticipants) {
                        socket.to(`user:${otherId}`).emit("typing", typingPayload)
                    }
                }
            } catch (error) {

            }
        })
        socket.on("disconnect", () => {
            onlineUsers.delete(userId)

            //notify others
            socket.broadcast.emit("user-offline", { userId })
        })
    })
    return io
}