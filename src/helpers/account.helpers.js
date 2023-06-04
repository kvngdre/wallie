import AccountRepository from '../account/account.repository.js';
import AccountService from '../account/account.service.js';
import AccountValidator from '../account/account.validator.js';
import TransactionRepository from '../transaction/transaction.repository.js';
import UserRepository from '../user/user.repository.js';
import ApiResponse from '../utils/apiResponse.utils.js';

const accountValidator = new AccountValidator();
const accountRepository = new AccountRepository();
const userRepository = new UserRepository();
const transactionRepository = new TransactionRepository();

const accountService = new AccountService(
  accountRepository,
  userRepository,
  transactionRepository,
);

/**
 * Validates and credits an account with a given amount.
 * @param {string} accountId - The ID of the account to credit.
 * @param {import('../account/dto/credit-account.dto.js').CreditAccountDto} body  - The request body containing the account information.
 * @returns {Promise<ApiResponse>}  A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
 * @throws {ValidationError} If the request body is invalid.
 */
export async function validateAndCredit(accountId, body) {
  const { value, error } = accountValidator.validateCreditAccount(body);
  if (error) throw new ValidationError('Validation Error', error);

  return await accountService.credit(accountId, value);
}

/**
 * Validates and debits an account with a given amount.
 * @param {string} accountId - The ID of the account to credit.
 * @param {Record<string, any>} body - The request body
 * @returns {Promise<ApiResponse>}  A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
 * @throws {ValidationError} If the request body is invalid.
 */
export async function validateAndDebit(accountId, body) {
  const { value, error } = accountValidator.validateDebitAccount(body);
  if (error) throw new ValidationError('Validation Error', error);

  return await accountService.debit(accountId, value);
}
