import * as accountService from "../service/accountService.js"
import * as userService from "../service/userService.js"
export const getAccountByName = async (req, res) => {
    const userId = req.user.id

    try {

    } catch (error) {
        console.error("Error in getAccountByName controller:", error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }
}

export const getAccount = async (req, res) => {
    const userId = req.user.id

    try {

        const userExist = await userService.findByUserId(userId)
        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }
        let accountDetial = await accountService.getAccount(userExist.id)
        if (!accountDetial || accountDetial.length === 0) {
            await accountService.createAccountForUser(userExist.id)
            accountDetial = await accountService.getAccount(userExist.id)
        }
        return res.status(200).json(accountDetial)
    } catch (error) {
        console.error("Error in getAccount controller:", error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }
}

export const addGoalAccount = async (req, res) => {
    const userId = req.user.id
    const { goalName, targetAmount } = req.body;

    try {
        const userExist = await userService.findByUserId(userId)
        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }
        const result = await accountService.createGoalAccount(userExist.id, userExist.currency, goalName, targetAmount)
        const accounts = await accountService.getAccount(userExist.id)
        return res.status(200).json(accounts)
    } catch (error) {
        console.error("Error in addGoalAccount controller:", error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }

}

export const addAccount = async (req, res) => {
    const userId = req.user.id
    const { accountName, accountType } = req.body;
    try {
        const userExist = await userService.findByUserId(userId)
        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }
        const result = await accountService.createAccount(userExist.id, userExist.currency, accountName, accountType)
        const accounts = await accountService.getAccount(userExist.id)
        return res.status(200).json(acccounts)
    } catch (error) {
        console.error("Error in addAccount controller:", error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }

}

export const deleteGoalAccount = async (req, res) => {
    const userId = req.user.id
    const goalId = req.body;
    try {
        const userExist = await userService.findByUserId(userId)
        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }

        const account = await accountService.getAccountUsingAccountId(goalId)
        if (
            account.name === "WORKING_CAPITAL" ||
            account.name === "EMERGENCY_FUND" ||
            account.name === "DAILY_EXPENSES"
        ) {
            return res.status(400).json({
                code: "CANNOT_BE_DELETED"
            })
        }

        const result = await accountService.deleteGoal(userExist.id, goalId)
        if (!result) {
            return res.status(404).json({ code: "ACCOUNT_NOT_FOUND" })
        }
        return res.status(200).json({ result, code: "ACCOUNT_DELETED" })
    } catch (error) {
        console.error("Error in deleteGoalAccount controller:", error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }

}