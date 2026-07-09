import * as  transactionService from "../service/transactionService.js";
import * as userService from "../service/userService.js"
import * as accountService from "../service/accountService.js"


export const getTransaction = async (req, res) => {
    const userId = req.user.id;
    try {
        const userExist = await userService.findByUserId(userId)
        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }

        const result = await transactionService.getTransaction(userId)
        return res.status(200).json(result)
    } catch (error) {
        console.error("Error in getTransactions controller:", error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }

}

export const createTransaction = async (req, res) => {
    const userId = req.user.id;
    const clientData = req.body;

    try {
        const userExist = await userService.findByUserId(userId)
        if (!userExist) {
            return res.status(404).json({ code: "USER_NOT_FOUND" })
        }
        let targetAccount = await accountService.getAccountByName(userId, clientData.toAccountName)
        
        if (!targetAccount) {
            targetAccount = await accountService.createAccount(userId, userExist.currency, clientData.toAccountName, clientData.accountType)
        }

        const transactionResult = await transactionService.createTransaction(userId, clientData.fromAccId, targetAccount.id, clientData.amount, clientData.accountType, clientData.note)

        const updateAccount = await accountService.updateAccount(userId, clientData.fromAccId, targetAccount.id, clientData.amount)

        return res.status(201).json({
            code: "TRANSACTION_CREATED_SUCCESS",
            data: transactionResult
        });
    } catch (error) {
        console.error("Error in createTransaction controller:", error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }
}