import ValidationError from '../errors/validation.error.js';
import { ApiResponse } from '../utils/apiresponse.utils.js';
import formatErrorMsg from '../utils/formatErrorMessage.js';
import HttpCode from '../utils/httpCodes.utils.js';
import AccountService from './account.service.js';
import AccountValidator from './account.validator.js';

const accountValidator = new AccountValidator();
const accountService = new AccountService();

class AccountController {
  #accountService;
  #accountValidator;

  /**
   * @class AccountController
   * @param {AccountService} accountService
   * @param {AccountValidator} accountValidator
   */
  constructor(accountService, accountValidator) {
    this.#accountService = accountService;
    this.#accountValidator = accountValidator;
  }

  /** @type {ControllerFunction<{}, {}, CreateAccountDto>} */
  createAccount = async (req, res) => {
    const { value, error } = this.#accountValidator.validateNewAccountDto(
      req.body,
    );
    if (error) throw new ValidationError('Validation Error', true, error);

    const response = await this.#accountService.createAccount(value);

    res.status(HttpCode.CREATED).json(response);
  };

  /** @type {ControllerFunction} */
  getAccounts = async (req, res) => {
    const { value, error } = this.#accountValidator.validateAccountFilter(
      req.query,
    );
    if (error) {
      throw new ValidationError({ message: 'Validation Error', data: error });
    }

    const response = await this.#accountService.getAccounts(value);

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction<{ accountId: string }>} */
  getAccount = async (req, res) => {
    const response = await this.#accountService.getAccount(
      req.params.accountId,
    );

    res.status(HttpCode.OK).json(response);
  };

  async getCurrentUserAccount(req, res) {
    const account = await accountService.getAccount(req.currentUser.id);
    const response = new ApiResponse('Fetched account.', account);

    res.status(HttpCode.OK).json(response);
  }

  updateAccount = async (req, res) => {
    // Validating new account dto
    const { error } = accountValidator.validateUpdateAccountDto(req.body);
    if (error) {
      const errorMsg = formatErrorMsg(error.details[0].message);
      throw new ValidationError(errorMsg);
    }

    const updatedAccount = await accountService.updateAccount(
      req.currentUser.id,
      req.body,
    );
    const response = new ApiResponse('Account updated.', updatedAccount);

    res.status(HttpCode.OK).json(response);
  };

  deleteAccount = async (req, res) => {
    await accountService.deleteAccount(req.params.id);
    const response = new ApiResponse('Account deleted.');

    res.status(HttpCode.OK).send(response);
  };

  async getBalance(req, res) {
    const accountBalance = await accountService.getBalance(req.currentUser);
    const response = new ApiResponse('Fetched balance.', accountBalance);

    res.status(HttpCode.OK).json(response);
  }

  async fundAccount(req, res) {
    const { body, currentUser } = req;

    // Validating fund account dto
    const { error } = accountValidator.validateCreditAccountDto(req.body);
    if (error) {
      const errorMsg = formatErrorMsg(error.details[0].message);
      throw new ValidationError(errorMsg);
    }

    const account = await accountService.creditAccount(currentUser, body);
    const response = new ApiResponse('Account credited.', account);

    res.status(HttpCode.OK).json(response);
  }

  async debitAccount(req, res) {
    const { body, currentUser } = req;

    // Validating debit account dto
    const { error } = accountValidator.validateDebitAccountDto(body);
    if (error) {
      const errorMsg = formatErrorMsg(error.details[0].message);
      throw new ValidationError(errorMsg);
    }

    const account = await accountService.debitAccount(currentUser, body);
    const response = new ApiResponse('Account debited.', account);

    res.status(HttpCode.OK).json(response);
  }

  async transferFunds(req, res) {
    const { body, currentUser } = req;

    // Validating transfer funds dto
    const { error } = accountValidator.validateTransferDto(body, currentUser);
    if (error) {
      const errorMsg = formatErrorMsg(error.details[0].message);
      throw new ValidationError(errorMsg);
    }

    const account = await accountService.transferFunds(currentUser.id, body);
    const response = new ApiResponse('Transfer successful.', account);

    res.status(HttpCode.OK).json(response);
  }
}

export default AccountController;
