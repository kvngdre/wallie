import _ from 'lodash';
import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import InsufficientFundsError from '../errors/InsufficientFunds.error.js';
import NotFoundError from '../errors/notFound.error.js';
import UnauthorizedError from '../errors/unauthorized.error.js';
import pubsub from '../pubsub/PubSub.js';
import events from '../pubsub/events.js';
import TransactionRepository from '../transaction/transaction.repository.js';
import TransactionService from '../transaction/transaction.service.js';
import UserRepository from '../user/user.repository.js';
import ApiResponse from '../utils/apiResponse.utils.js';
import { TxnPurpose } from '../utils/common.utils.js';
import { TxnType } from '../utils/constants.utils.js';
import formatItemCountMessage from '../utils/formatItemCountMessage.js';
import AccountRepository from './account.repository.js';

const accountRepository = new AccountRepository();

class AccountService {
  #accountRepository;
  #userRepository;
  #transactionRepository;

  /**
   * @class AccountService
   * @param {AccountRepository} accountRepository
   * @param {UserRepository} userRepository
   * @param {TransactionRepository} transactionRepository
   */
  constructor(accountRepository, userRepository, transactionRepository) {
    this.#accountRepository = accountRepository;
    this.#userRepository = userRepository;
    this.#transactionRepository = transactionRepository;
  }

  /**
   * This creates an account
   * @param {CreateAccountDto} createAccountDto - A data transfer object with  account information.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async createAccount(createAccountDto) {
    const foundUser = await this.#userRepository.findById(
      createAccountDto.user_id,
    );
    if (!foundUser) {
      throw new NotFoundError('Operation failed, user not found.');
    }

    const newAccount = await this.#accountRepository.insert(createAccountDto);

    return new ApiResponse(
      'Account Created Successfully',
      newAccount.toObject(),
    );
  }

  /**
   * This function is used to find accounts that match the filter if any.
   * @param {AccountFilter} filter
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async getAccounts(filter) {
    // { balance: { min: 50, max: 100 } }
    const foundAccounts = await this.#accountRepository.find(filter);
    if (foundAccounts.length === 0) {
      throw new NotFoundError('No Accounts Found');
    }
    const message = formatItemCountMessage(foundAccounts.length);

    return new ApiResponse(message, foundAccounts);
  }

  /**
   * Retrieves a user account by account ID.
   * @param {string} accountId - The ID of the account being requested.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   * @throws {NotFoundError} if the user account cannot be found.
   */
  async getAccount(accountId) {
    const foundAccount = await this.#accountRepository.findById(accountId);
    if (!foundAccount) throw new NotFoundError('Account Not Found');

    return new ApiResponse('Account Found', foundAccount.toObject());
  }

  /**
   *
   * @param {string} accountId - The ID of the account whose pin is to be changed.
   * @param {UpdateAccountDto} updateAccountDto
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async changePin(accountId, updateAccountDto) {
    await this.#accountRepository.update(accountId, updateAccountDto);

    return new ApiResponse('Account Updated Successfully');
  }

  /**
   * Deletes the user account by account ID.
   * @param {string} accountId - The ID of the account which will be deleted.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async deleteAccount(accountId) {
    // await this.#accountRepository.delete(accountId);

    return new ApiResponse('Account Deleted Successfully');
  }

  /**
   * Gets the balance of a user account by user ID.
   * @param {string} userId - The ID of the user whose balance is requested.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async getBalance(userId) {
    const { id, balance } = await this.#accountRepository.findByUserId(userId);

    return new ApiResponse('Success', { id, balance });
  }

  /**
   *
   * @param {string} accountId - The ID of the account to credit.
   * @param {CreditAccountDto} creditAccountDto
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   * @throws {NotFoundError} if the user account cannot be found.
   * @throws {Error} If any other error occurs while crediting account.
   */
  async creditAccount(accountId, creditAccountDto) {
    const result = await Model.transaction(async (trx) => {
      const { amount, description } = creditAccountDto;

      const foundAccount = await this.#accountRepository.findById(accountId);
      if (!foundAccount) {
        throw new NotFoundError('Operation failed. Account not found.');
      }

      await foundAccount.$query(trx).increment('balance', amount);

      // Emitting onAccountCredit event.
      await this.#transactionRepository.insert({
        account_id: foundAccount.id,
        type: TxnType.CREDIT,
        purpose: TxnPurpose.DEPOSIT,
        amount,
        description,
        balance_before: Number(foundAccount.balance),
        balance_after: Number(foundAccount.balance) + amount,
      });

      // Transaction is committed and result returned.
      return _.pick(foundAccount, ['id', 'balance']);
    });

    return new ApiResponse('Deposit Successful', result);
  }

  async debitAccount(currentUser, debitAccountDto) {}

  async transferFunds(currentUserId, transferFundsDto) {
    try {
      const updatedAccount = await Model.transaction(async (trx) => {
        const { findById, findOne } = accountRepository;
        const { amount, desc, dest_id, pin } = transferFundsDto;

        const [sourceAccount, destinationAccount] = await Promise.all([
          findOne({ user_id: currentUserId }, 'Source account not found.'),
          findById(dest_id, 'Destination account not found.'),
        ]);

        await debitSourceAndEmitEvent(pin);
        async function debitSourceAndEmitEvent(pin) {
          const { id, balance, comparePins, omitPin } = sourceAccount;

          const isMatch = comparePins(pin);
          if (!isMatch) throw new UnauthorizedError('Invalid pin');
          else omitPin();

          // Debit source account
          await decrementBalance(sourceAccount, amount, trx);

          // Emitting onAccountDebit event.
          await pubsub.publish(
            events.account.debit,
            new NewTransaction(
              id,
              TxnType.DEBIT,
              TxnPurpose.TRANSFER,
              amount,
              desc,
              balance,
            ),
            trx,
          );
        }

        await creditDestinationAndEmitEvent();
        async function creditDestinationAndEmitEvent() {
          const { id, balance } = destinationAccount;

          await incrementBalance(destinationAccount, amount, trx);

          // Emitting onAccountCredit event.
          await pubsub.publish(
            events.account.credit,
            new NewTransaction(
              id,
              TxnType.CREDIT,
              TxnPurpose.TRANSFER,
              amount,
              desc,
              balance,
            ),
            trx,
          );
        }

        // Transaction is committed and result returned.
        return sourceAccount;
      });

      return updatedAccount;
    } catch (exception) {
      // Transaction is rolled back on exception.
      throw exception;
    }
  }
}

async function decrementBalance(account, amount, trx) {
  const balance = Number(account.balance);
  if (balance < amount) throw new InsufficientFundsError('Insufficient funds.');

  const newBalance = Number((balance - amount).toFixed(2));
  await account.$query(trx).patch({ balance: newBalance });
}

async function incrementBalance(account, amount, trx) {
  const balance = Number(account.balance);

  const newBalance = Number((balance + amount).toFixed(2));
  await account.$query(trx).patch({ balance: newBalance });
}

/**
 * Constructs a new transaction object.
 * @param {number} id
 * @param {string} type
 * @param {string} purpose
 * @param {number} amount
 * @param {string} desc
 * @param {number} balance
 */
function NewTransaction(id, type, purpose, amount, desc, balance) {
  this.account_id = id;
  this.type = type;
  this.purpose = purpose;
  this.amount = amount;
  this.description = desc;
  this.bal_before = Number(balance);
  this.bal_after =
    type === TxnType.DEBIT
      ? Number(balance) - amount
      : Number(balance) + amount;
}

export default AccountService;
