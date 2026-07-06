import { query } from "../utlis/db.js"
import { v4 as uuidv4 } from "uuid";

export const findByUserId = async (userId) => {
    const { rows } = await query(
        `SELECT * FROM users WHERE id = $1`,
        [userId]
    )
    return rows[0]
}

export const findByClerkId = async (clerkId) => {
    const { rows } = await query(
        `SELECT * FROM users WHERE clerkid = $1`,
        [clerkId]
    )
    return rows[0]
}

export const createUserFromClerk = async ({ clerkId, username, avatar_url }) => {
    const opid = `OP${Date.now()}`;
    const id = uuidv4();
    const { rows } = await query(
        `INSERT INTO users(
        id,
        clerkid,
        opid,
        username,
        avatar_url,
        country,
        currency
        ) 
        VALUES(
        $1, $2, $3, $4, $5, $6, $7
        )
        RETURNING
        id,
        clerkid,
        opid,
        username,
        avatar_url,
        avatar_public_id,
        country,
        currency,
        is_premium
        `, [id, clerkId, opid, username, avatar_url, "MALAYSIA", "MYR"]
    )
    return rows[0]
}

export const userData = async (clerkId) => {
    const { rows } = await query(
        `SELECT id, opid, opid_updated_at, username, country, is_premium, currency, avatar_url, avatar_public_id
        FROM users
        WHERE clerkid = $1`,
        [clerkId])
    return rows[0]
}

export const existedOpid = async (Opid) => {
    const { rows } = await query(
        `SELECT id 
        FROM users
        WHERE opid = $1`,

        [Opid]
    )
    return rows[0]
}

export const updateData = async (clientData, clerkId) => {
    const allowedFields = [
        "username",
        "opid",
        "country",
        "currency",
    ]

    const updates = [];
    const values = [];
    let index = 1;

    for (const field of allowedFields) {
        if (clientData[field] !== undefined) {
            updates.push(`${field} = $${index}`);
            values.push(clientData[field]);
            index++;
        }// this is to know is the data sended
    }
    if (clientData.opid !== undefined) {
        updates.push(`opid_updated_at = CURRENT_TIMESTAMP`);
    }
    if (updates.length === 0) {
        throw new Error("NO_VALID_FIELDS")
    }
    values.push(clerkId)
    const { rows } = await query(
        `UPDATE users
        SET ${updates.join(", ")}
        WHERE clerkid = $${index}
        RETURNING 
        id, opid, opid_updated_at, username, country, is_premium, currency, avatar_url
        `,
        values
    )
    return rows[0]
}

export const changeCurrency = async (currency, exchangeRate, userId) => {
    const { rows } = await query(
        `UPDATE account 
        SET currency = $1,
        current_balance = current_balance * $2
        WHERE userid = $3
        RETURNING *`, [
        currency, exchangeRate, userId
    ]
    )
    return rows;
}

export const changeProfilePic = async (imageUrl, newPublicId, clerkId) => {
    const { rows } = await query(
        `UPDATE users
        SET avatar_url = $1,
        avatar_public_id = $2
        WHERE clerkid = $3
        RETURNING *`,
        [imageUrl, newPublicId, clerkId]
    )
    return rows[0]
}