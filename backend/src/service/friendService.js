import { query } from "../utlis/db.js"
import { v4 as uuidv4 } from "uuid";
export const friendList = async (userId) => {
    const { rows } = await query(
        `SELECT 
            fr.id,
            fr.sender_id,
            fr.receiver_id,
            fr.request_status,
            fr.created_at,
            u.username,
            u.opid,
            u.avatar_url
         FROM friend_request fr
         JOIN users u ON u.id = fr.sender_id
         WHERE (fr.receiver_id = $1 OR fr.sender_id = $1) AND fr.request_status = $2
         ORDER BY fr.created_at DESC`, [
        userId, 'accepted'
    ]
    )
    return rows
}

export const allRequest = async (userId) => {
    const { rows } = await query(
        `SELECT 
            fr.id,
            fr.sender_id,
            fr.receiver_id,
            fr.request_status,
            fr.created_at,
            u.username,
            u.opid,
            u.avatar_url
         FROM friend_request fr
         JOIN users u ON u.id = fr.sender_id
         WHERE fr.receiver_id = $1 AND fr.request_status != $2
         ORDER BY fr.created_at DESC`, [
        userId, 'accepted'
    ]
    )
    return rows
}
export const friendRealtion = async (userId, friendId) => {
    const { rows } = await query(
        `SELECT request_status FROM friend_request
        WHERE (sender_id = $1 OR receiver_id = $1 ) AND (sender_id = $2 OR receiver_id = $2 )`, [
        userId, friendId
    ]
    )
    return rows[0]
}

export const existRelation = async (userId, requestId) => {
    const { rows } = await query(
        `SELECT * FROM friend_request
        WHERE receiver_id = $1 AND id = $2 `, [
        userId, requestId
    ]
    )
    return rows[0]
}

export const sendRequest = async (userId, friendId) => {
    const id = uuidv4();
    const { rows } = await query(
        `INSERT INTO friend_request(
            id,
            sender_id,
            receiver_id,
            request_status
        )VALUES(
            $1,
            $2,
            $3,
            $4
            )
        RETURNING *`, [
        id, userId, friendId, 'pending'
    ]
    )
    return rows[0]
}

export const responseToRequest = async (userId, requestId, respondRequest) => {
    const { rows } = await query(
        `UPDATE friend_request
        SET request_status = $1 
        WHERE receiver_id = $2 AND id = $3`, [
        respondRequest, userId, requestId
    ]
    )
    return rows[0]
}