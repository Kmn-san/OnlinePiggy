import { query } from "../utlis/db.js"
import { v4 as uuidv4 } from "uuid";

export const getAccount = async (userId) => {
    const { rows } = await query(
        `SELECT * from account WHERE userId = $1`,
        [userId]
    )
    return rows[0]
}

import { v4 as uuidv4 } from "uuid";
import { query } from "../db";

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