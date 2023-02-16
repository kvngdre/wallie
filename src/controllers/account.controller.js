const {
    validateCreditAccountDto,
    validateDebitAccountDto,
    validateNewAccountDto,
    validateTransferDto,
    validateUpdateAccountDto,
} = require('../validators/account.validator');
const { httpStatusCodes } = require('../utils/constants');
const accountService = require('../services/account.service');
const formatErrorMsg = require('../utils/formatErrorMsg');
const ValidationException = require('../errors/ValidationError');
const APIResponse = require('../utils/APIResponse');

class AccountController {
    static async createAccount(req, res) {
        const { body, currentUser } = req;

        // Validating new account dto
        const { error } = validateNewAccountDto(body);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const account = await accountService.createAccount(body, currentUser);
        const response = new APIResponse('Account created.', account);

        return res.status(httpStatusCodes.CREATED).json(response);
    }

    static async getAllAccounts(req, res) {
        const { count, foundAccounts } = await accountService.getAccounts();

        function getMessage() {
            if (count == 1) return `${count} record found.`;
            return `${count} records found.`;
        }
        const response = new APIResponse(getMessage(), foundAccounts);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async getCurrentUserAccount(req, res) {
        const account = await accountService.getAccount(req.currentUser.id);
        const response = new APIResponse('Fetched account.', account);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async getAccount(req, res) {
        const account = await accountService.getAccount(req.params.id);
        const response = new APIResponse('Fetched account.', account);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async updateAccount(req, res) {
        // Validating new account dto
        const { error } = validateUpdateAccountDto(req.body);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const updatedAccount = await accountService.updateAccount(req.currentUser.id, req.body);
        const response = new APIResponse('Account updated.', updatedAccount);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async deleteAccount(req, res) {
        await accountService.deleteAccount(req.params.id);
        const response = new APIResponse('Account deleted.');

        return res.status(httpStatusCodes.OK).send(response);
    }

    static async getBalance(req, res) {
        const accountBalance = await accountService.getBalance(req.currentUser);
        const response = new APIResponse('Fetched balance.', accountBalance);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async fundAccount(req, res) {
        const { body, currentUser } = req;

        // Validating fund account dto
        const { error } = validateCreditAccountDto(req.body);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const account = await accountService.creditAccount(currentUser, body);
        const response = new APIResponse('Account credited.', account);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async debitAccount(req, res) {
        const { body, currentUser } = req;

        // Validating debit account dto
        const { error } = validateDebitAccountDto(body);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const account = await accountService.debitAccount(currentUser, body);
        const response = new APIResponse('Account debited.', account);

        return res.status(httpStatusCodes.OK).json(response);
    }

    static async transferFunds(req, res) {
        const { body, currentUser } = req;

        // Validating transfer funds dto
        const { error } = validateTransferDto(body, currentUser);
        if (error) {
            const errorMsg = formatErrorMsg(error.details[0].message);
            throw new ValidationException(errorMsg);
        }

        const account = await accountService.transferFunds(
            currentUser.id,
            body
        );
        const response = new APIResponse('Transfer successful.', account);

        return res.status(httpStatusCodes.OK).json(response);
    }
}

module.exports = AccountController;
