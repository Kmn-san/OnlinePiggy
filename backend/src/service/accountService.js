import { query } from "../utlis/db.js"
import { v4 as uuidv4 } from "uuid";

export const getAccount = async (userId) => {
    const { rows } = await query(
        `SELECT * from account WHERE userid = $1`,
        [userId]
    )
    return rows;
}

export const getAccountByName = async (userId, accountName) => {
    const { rows } = await query(
        `SELECT * from account 
        WHERE userid = $1 
        AND name = $2
        `,
        [userId, accountName]
    )
    return rows[0];
}

export const updateAccount = async (userId, fromAccId, toAccId, amount) => {
    let updatedFromAccount = null;
    let updatedToAccount = null;

    if (fromAccId) {
        const { rows } = await query(
            `UPDATE account
             SET current_balance = current_balance - $1
             WHERE userid = $2 AND id = $3
             RETURNING *`,
            [amount, userId, fromAccId]
        );

        updatedFromAccount = rows[0];
    }

    if (toAccId) {
        const { rows } = await query(
            `UPDATE account
             SET current_balance = current_balance + $1
             WHERE userid = $2 AND id = $3
             RETURNING *`,
            [amount, userId, toAccId]
        );

        updatedToAccount = rows[0];
    }

    return {
        updatedFromAccount,
        updatedToAccount,
    };
};

// when user just created the account
export const createAccountForUser = async (userId) => {
    const workingCapitalId = uuidv4();
    const emergencyFundId = uuidv4();
    const dailyExpensesId = uuidv4();

    await query(
        `
    INSERT INTO account (
      id,
      userid,
      name,
      type,
      target_amount,
      current_balance,
      currency,
      is_premium,
      is_achived
    )
    VALUES
      (
        $1,
        $2,
        'WORKING_CAPITAL',
        'SAVINGS',
        0,
        0,
        'MYR',
        FALSE,
        FALSE
      ),
      (
        $3,
        $2,
        'EMERGENCY_FUND',
        'SAVINGS',
        0,
        0,
        'MYR',
        FALSE,
        FALSE
      ),
       (
        $4,
        $2,
        'DAILY_EXPENSES',
        'EXPENSES',
        0,
        0,
        'MYR',
        FALSE,
        FALSE
      )
        RETURNING *
    `,
        [
            workingCapitalId,
            userId,
            emergencyFundId,
            dailyExpensesId
        ]
    );
};

// when user want to create a new account
export const createAccount = async (userId, currency, accountName, accountType) => {
    const accountId = uuidv4();
    const { rows } = await query(
        `
        INSERT INTO account (
            id,
            userid,
            name,
            type,
            target_amount,
            current_balance,
            currency,
            is_premium,
            is_achived
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            0,
            0,
            $5,
            FALSE,
            FALSE
        )
        RETURNING *;
        `,
        [
            accountId,
            userId,
            accountName,
            accountType,
            currency
        ]
    );

    return rows[0];
};

export const createGoalAccount = async (
    userId,
    currency,
    goalName,
    targetAmount
) => {
    const goalAccountId = uuidv4();

    const { rows } = await query(
        `
        INSERT INTO account (
            id,
            userid,
            name,
            type,
            target_amount,
            current_balance,
            currency,
            is_premium,
            is_achived
        )
        VALUES (
            $1,
            $2,
            $3,
            'GOAL',
            $4,
            0,
            $5,
            FALSE,
            FALSE
        )
        RETURNING *;
        `,
        [
            goalAccountId,
            userId,
            goalName,
            targetAmount,
            currency
        ]
    );

    return rows[0];
};

export const deleteGoal = async (userId, goalId) => {
    const { rows } = await query(
        `DELETE FROM account 
        WHERE userId = $1
        AND goalId = $2
        RETURNING *`,
        [userId, goalId]
    )
    return rows[0]
}