import { query } from "../utlis/db.js"

export const getChats = async (userId) => {
    const { rows } = await query(
        `
        SELECT
            cr.id AS room_id,
            cr.is_group,
            cr.created_at AS room_created_at,
            u.id AS other_user_id,
            u.username AS other_username,
            u.avatar_url AS other_avatar_url,
            u.opid AS other_opid,
            m.id AS last_message_id,
            m.message_text,
            m.created_at AS last_message_at
        FROM chat_room cr
        --1. Find rooms where the current user is a participant
        JOIN room_participants rp_me
            ON cr.id = rp_me.room_id AND rp_me.user_id = $1
        --2. Join participants again to get the OTHER person in the room
        LEFT JOIN room_participants rp_other
            ON cr.id = rp_other.room_id AND rp_other.user_id != $1
        --3. Get the User details for that other person 
        LEFT JOIN "User" u
            ON rp_other.user_id = u.id
        --4. GET only the LATEST message for the room
        LEFT JOIN LATERAL (
            SELECT id, message_text, created_at
            FROM messages
            WHERE room_id = cr.id
            ORDER BY created_at DESC
            LIMIT 1
        ) m ON true
        --5. Order the final list by the latest message time, or room creation time if empty
        ORDER BY COALESCE(m.created_at, cr.created_at) DESC;
        `, [
        userId
    ]
    )
    return rows
}

export const getChatsWithChatId = async (userId, chatId) => {
    const { rows } = await query(
        `
            SELECT cr.id AS room_id, cr.is_group
            FROM chat_room cr
            JOIN room_participants rp ON cr.id = rp.room_id
            WHERE cr.id = $1 AND rp.user_id = $2
        `,
        [chatId, userId]
    )
    return rows[0]
}

export const getChatParticipants = async (chatId) => {
    const { rows } = await query(
        `SELECT user_id FROM room_participants WHERE room_id = $1`,
        [chatId]
    );

    // Returns a flat array of IDs: ['uuid-1', 'uuid-2']
    return rows.map(row => row.user_id);
};

export const existingChatQuery = async (userId, participantId) => {
    const { rows } = await query(
        `
        SELECT 
            cr.id AS room_id, cr.created_at, m.id AS last_message_id,
            m.message_text, m.created_at AS last_message_at
        FROM chat_room cr
        JOIN room_participants rp1 ON cr.id = rp1.room_id
        JOIN room_participants rp2 ON cr.id = rp2.room_id
        LEFT JOIN LATERAL (
            SELECT id, message_text, created_at
            FROM messages
            WHERE room_id = cr.id
            ORDER BY created_at DESC
            LIMIT 1
        ) m On true
        WHERE cr.is_group = false
            AND rp1.user_id = $1
            AND rp2.user_id = $2
        `, [
        userId, participantId
    ]
    )
    return rows[0]
}

export const createChat = async (userId, participantId) => {
    const { rows } = await query(
        `
        WITH new_room AS (
            --1. Create the room and return its ID ans creation date
            INSERT INTO chat_room (is_group)
            VALUES(false)
            RETURNING id, created_at
        ),
        insert_participants AS (
            --2. Use the ID from the step above to insert the participants
            INSERT INTO room_participants (room_id, user_id)
            VALUES
                ((SELECT id FROM new_room),$1),
                ((SELECT id FROM new_room),$2)
        )
        --3. Return the new room details back to Node.js
        SELECT id , created_at FROM new_room
        `,
        [userId, participantId]
    )
    return rows[0]
}