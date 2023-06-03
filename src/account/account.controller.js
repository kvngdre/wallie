import ValidationError from '../errors/validation.error.js';
import ApiResponse from '../utils/apiResponse.utils.js';
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

  /** @type {ControllerFunction<{ accountId: string }>} */
  creditAccount = async (req, res) => {
    const { value, error } = this.#accountValidator.validateCreditAccount(
      req.body,
    );

    if (error) {
      throw new ValidationError('Validation Error', error);
    }

    const response = await this.#accountService.creditAccount(
      req.params.accountId,
      value,
    );

    res.status(HttpCode.OK).json(response);
  };

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
