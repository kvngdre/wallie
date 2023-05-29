import { Model } from 'objection';
import InsufficientFundsError from '../errors/InsufficientFunds.error.js';
import NotFoundError from '../errors/notFound.error.js';
import UnauthorizedError from '../errors/unauthorized.error.js';
import pubsub from '../pubsub/PubSub.js';
import events from '../pubsub/events.js';
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

  /**
   * @class AccountService
   * @param {AccountRepository} accountRepository
   * @param {UserRepository} userRepository
   */
  constructor(accountRepository, userRepository) {
    this.#accountRepository = accountRepository;
    this.#userRepository = userRepository;
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
   * @param {*} filter
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
   * Retrieves the user by it's unique id field.
   * @param {string} accountId
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async getAccount(accountId) {
    const foundAccount = await this.#accountRepository.findById(accountId);
    if (!foundAccount) throw new NotFoundError('Account Not Found');

    return new ApiResponse('Account Found', foundAccount.toObject());
  }

  /**
   *
   * @param {string} accountId
   * @param {UpdateAccountDto} updateAccountDto
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async changeAccountPin(accountId, updateAccountDto) {
    await this.#accountRepository.update(accountId, updateAccountDto);

    return new ApiResponse('Account Updated Successful');
  }

  /**
   *
   * @param {string} accountId - The account id.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async deleteAccount(accountId) {
    // await this.#accountRepository.delete(accountId);

    return new ApiResponse('Account Deleted Successfully');
  }

  /**
   *
   * @param {string} currentUser
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async getBalance(currentUser) {
    const { id, balance } = await this.#accountRepository.findOne({
      user_id: currentUser.id,
    });

    return new ApiResponse('Success', { id, balance });
  }

  async creditAccount(currentUser, fundAccountDto) {
    try {
      const updatedAccount = await Model.transaction(async (trx) => {
        const foundAccount = await accountRepository.findOne({
          user_id: currentUser.id,
        });

        const { amount, desc } = fundAccountDto;
        const { id, balance, omitPin } = foundAccount;
        omitPin();

        await incrementBalance(foundAccount, amount, trx);

        // Emitting onAccountCredit event.
        await pubsub.publish(
          events.account.credit,
          new NewTransaction(
            id,
            TxnType.CREDIT,
            TxnPurpose.DEPOSIT,
            amount,
            desc,
            balance,
          ),
          trx,
        );

        // Transaction is committed and result returned.
        return foundAccount;
      });

      return updatedAccount;
    } catch (exception) {
      // Transaction is rolled back on exception.
      throw exception;
    }
  }

  async debitAccount(currentUser, debitAccountDto) {
    try {
      const updatedAccount = await Model.transaction(async (trx) => {
        const foundAccount = await accountRepository.findOne({
          user_id: currentUser.id,
        });

        const { amount, desc, pin } = debitAccountDto;
        const { id, balance, comparePins, omitPin } = foundAccount;

        const isMatch = comparePins(pin);
        if (!isMatch) throw new UnauthorizedError('Invalid pin');
        else omitPin();

        await decrementBalance(foundAccount, amount, trx);

        // Emitting onAccountDebit event.
        await pubsub.publish(
          events.account.debit,
          new NewTransaction(
            id,
            TxnType.DEBIT,
            TxnPurpose.WITHDRAW,
            amount,
            desc,
            balance,
          ),
          trx,
        );

        // Transaction is committed and result returned.
        return foundAccount;
      });

      return updatedAccount;
    } catch (exception) {
      // Transaction is rolled back on exception.
      throw exception;
    }
  }

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
