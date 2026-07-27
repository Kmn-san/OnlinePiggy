import { query } from "../utlis/db.js"

export const findMessages = async (chatId) => {
    const { rows } = await query(
        `
        SELECT 
            id,
            message_text,
            sender_id,
            is_read,
            created_at
        FROM messages
        WHERE room_id = $1
        ORDER BY created_at ASC
    `, [
        chatId
    ]
    )
    return rows;
}
export const createMessage = async (chatId, userId, text) => {
    const { rows } = await query(
        `
        WITH new_message AS (
            INSERT INTO messages (room_id,sender_id,message_text)
            VALUES($1,$2,$3)
            RETURNING id, room_id, sender_id, message_text, created_at
        )
        SELECT
            m.id AS message_id,
            m.room_id,
            m.message_text,
            m.created_at,
            u.id AS sender_id,
            u.username AS sender_name,
            u.avatar_url AS sender_avatar
        FROM new_message m
        JOIN "User" u ON m.sender_id = u.id
        `,
        [chatId, userId, text]
    )
    const row = rows[0];

    // Format the return object to match what the frontend expects
    return {
        _id: row.message_id,
        chat: row.room_id,
        text: row.message_text,
        createdAt: row.created_at,
        sender: {
            _id: row.sender_id,
            name: row.sender_name,
            avatar: row.sender_avatar
        }
    };
}