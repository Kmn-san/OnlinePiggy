import { query } from "../utlis/db.js"
import { v4 as uuidv4 } from "uuid";

export const getTransaction = async (userId) => {
    const { rows } = await query(
        `SELECT * FROM transactions
        WHERE userid = $1`,
        [userId]
    )
    return rows;
}

export const createTransaction = async (userId, fromAcc, toAcc, amount, type, note) => {
    const transactionId = uuidv4();
    const { rows } = await query(
        `INSERT INTO transactions(
            id,
            userid,
            from_account_id,
            to_account_id,
            amount,
            type,
            note
        )
            VALUES(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
            )
            RETURNING *
        `,
        [transactionId, userId, fromAcc, toAcc, amount, type, note]
    )
    return rows[0];
}