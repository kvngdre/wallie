import { Model } from 'objection';
import InsufficientFundsError from '../errors/InsufficientFunds.error.js';
import DuplicateError from '../errors/duplicate.error.js';
import UnauthorizedError from '../errors/unauthorized.error.js';
import pubsub from '../pubsub/PubSub.js';
import events from '../pubsub/events.js';
import { TxnPurpose } from '../utils/common.utils.js';
import { TxnType } from '../utils/constants.utils.js';
import Logger from '../utils/logger.utils.js';
import { UserRole } from '../utils/userRoles.utils.js';
import AccountRepository from './account.repository.js';

const logger = new Logger();
const accountRepository = new AccountRepository();

class AccountService {
  async createAccount(newAccountDto, currentUser) {
    newAccountDto.user_id = currentUser.id;

    const newAccount = await accountRepository.insert(newAccountDto);
    newAccount.omitPin();

    return newAccount;
  }

  async getAccounts() {
    const foundAccounts = await accountRepository.findAll();
    const count = Intl.NumberFormat('en-US').format(foundAccounts.length);

    // Modifying accounts array inplace to omit account pin.
    foundAccounts.forEach((acc) => acc.omitPin());

    return { count, foundAccounts };
  }

  async getAccount(accountId) {
    const foundAccount = await accountRepository.findById(accountId);
    foundAccount.omitPin();

    return foundAccount;
  }

  async updateAccount(accountId, updateAccountDto) {
    const updatedAccount = await accountRepository.update(
      accountId,
      updateAccountDto,
    );
    updatedAccount.omitPin();

    return updatedAccount;
  }

  async deleteAccount(accountId) {
    return await accountRepository.delete(accountId);
  }

  async getBalance(currentUser) {
    const { balance } = await accountRepository.findOne({
      user_id: currentUser.id,
    });

    return { balance };
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

        logger.silly('Performing transaction.');
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

        logger.silly('Pin ok, performing transaction.');
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
          logger.silly('Pin ok, debiting source account.');
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

          logger.silly('Crediting destination account.');
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
