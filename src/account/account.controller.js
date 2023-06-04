import ValidationError from '../errors/validation.error.js';
import {
  validateAndCredit,
  validateAndDebit,
} from '../helpers/account.helpers.js';
import ApiResponse from '../utils/apiResponse.utils.js';
import HttpCode from '../utils/httpCodes.utils.js';
import AccountService from './account.service.js';
import AccountValidator from './account.validator.js';

class AccountController {
  #accountService;
  #accountValidator;

  /**
   * A class that handles account-related requests and responses.
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

  /** @type {ControllerFunction<{ accountId: string }, {}, UpdateAccountDto>} */
  changeAccountPin = async (req, res) => {
    const { value, error } = this.#accountValidator.validateChangePin(req.body);
    if (error) {
      throw new ValidationError({ message: 'Validation Error', data: error });
    }

    const response = await this.#accountService.changePin(
      req.params.accountId,
      value,
    );

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction<{ accountId: string }>} */
  deleteAccount = async (req, res) => {
    const response = await this.#accountService.deleteAccount(req.params.id);

    res.status(HttpCode.OK).send(response);
  };

  /** @type {ControllerFunction} */
  getBalance = async (req, res) => {
    const response = await this.#accountService.getBalance(req.currentUser.id);

    res.status(HttpCode.OK).json(response);
  };

  /** @type {ControllerFunction<{ accountId: string }, {}, Record<string, any> & { type: string }} */
  createTransaction = async (req, res) => {
    let response;
    switch (req.body.type) {
      case 'credit':
        response = await validateAndCredit(req.params.accountId, req.body);
        break;
      case 'debit':
        response = await validateAndDebit(req.params.accountId, req.body);
        break;
      case 'transfer':
        break;
      default:
        throw new ValidationError('Invalid Transaction Type');
    }

    res.status(HttpCode.OK).json(response);
  };

  async transferFunds(req, res) {
    const { body, currentUser } = req;

    // Validating transfer funds dto
    const { error } = this.#accountValidator.validateTransferDto(
      body,
      currentUser,
    );
    if (error) {
      throw new ValidationError(errorMsg);
    }

    const account = await this.#accountService.transferFunds(
      currentUser.id,
      body,
    );
    const response = new ApiResponse('Transfer successful.', account);

    res.status(HttpCode.OK).json(response);
  }
}

export default AccountController;
