import bcrypt from 'bcryptjs';
import _ from 'lodash';
import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index.js';
import InsufficientFundsError from '../errors/InsufficientFunds.error.js';
import NotFoundError from '../errors/notFound.error.js';
import UnauthorizedError from '../errors/unauthorized.error.js';
import TokenRepository from '../token/token.repository.js';
import {
  TransactionPurpose,
  TransactionType,
} from '../transaction/jsdoc/transaction.types.js';
import TransactionRepository from '../transaction/transaction.repository.js';
import UserRepository from '../user/user.repository.js';
import ApiResponse from '../utils/apiResponse.utils.js';
import EmailService from '../utils/emailService.utils.js';
import generateOTP from '../utils/generateOTP.utils.js';
import AccountRepository from './account.repository.js';

class AccountService {
  #accountRepository;
  #userRepository;
  #transactionRepository;
  #emailService;
  #tokenRepository;

  /**
   * @class AccountService
   * @param {AccountRepository} accountRepository
   * @param {UserRepository} userRepository
   * @param {TransactionRepository} transactionRepository
   * @param {TokenRepository} tokenRepository
   * @param {EmailService} emailService
   */
  constructor(
    accountRepository,
    userRepository,
    transactionRepository,
    tokenRepository,
    emailService,
  ) {
    this.#accountRepository = accountRepository;
    this.#userRepository = userRepository;
    this.#transactionRepository = transactionRepository;
    this.#tokenRepository = tokenRepository;
    this.#emailService = emailService;
  }

  /**
   * This creates an account
   * @param {CreateAccountDto} createAccountDto - A data transfer object with  account information.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async create(createAccountDto) {
    const foundUser = await this.#userRepository.findById(
      createAccountDto.user_id,
    );
    if (!foundUser) {
      throw new NotFoundError('Operation failed, user not found.');
    }

    // Hashing the pin of the create account DTO. This is to ensure that pins are stored securely in the database.
    createAccountDto.pin = bcrypt.hashSync(pin, config.saltRounds);

    const newAccount = await this.#accountRepository.insert(createAccountDto);

    return new ApiResponse(
      'Account Created Successfully',
      newAccount.toObject(),
    );
  }

  /**
   * This function is used to find accounts that match the filter if any.
   * @param {import('./dto/account-filter.dto.js').AccountFilterDto} filter - A data transfer object for account fields to filter by.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   * @throws {NotFoundError} if the result array is of length zero.
   */
  async get(filter) {
    const foundAccounts = await this.#accountRepository.find(filter);

    if (foundAccounts.length === 0) {
      throw new NotFoundError('No Accounts Found');
    }

    // Format the number of found accounts with commas
    const count = foundAccounts.length;
    const formattedCount = Intl.NumberFormat('en-US').format(count);

    return new ApiResponse(
      `Found ${formattedCount} account(s) matching the filter.`,
      foundAccounts,
      { count },
    );
  }

  /**
   * Retrieves a user account by account ID.
   * @param {string} accountId - The ID of the account being requested.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   * @throws {NotFoundError} if the user account cannot be found.
   */
  async show(accountId) {
    const foundAccount = await this.#accountRepository.findById(accountId);
    if (!foundAccount) throw new NotFoundError('Account Not Found');

    return new ApiResponse('Account Found', foundAccount.toObject());
  }

  /**
   *
   * @param {string} accountId - The ID of the account whose pin is to be changed.
   * @param {ChangePinDto} changePinDto
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async changePin(accountId, changePinDto) {
    const { current_pin, new_pin } = changePinDto;

    const foundAccount = await this.#accountRepository.findById(accountId);
    if (!foundAccount) {
      throw new NotFoundError('Operation failed. Account not found.');
    }

    const isValid = foundAccount.validatePin(current_pin);
    if (!isValid) throw new UnauthorizedError('Incorrect Pin');

    // Hashing the new pin. This is to ensure that pins are stored securely in the database.
    const hashedPin = bcrypt.hashSync(new_pin, config.saltRounds);

    await foundAccount.$query().patch({ pin: hashedPin });

    return new ApiResponse('Pin Updated');
  }

  /**
   * Deletes the user account by account ID.
   * @param {string} accountId - The ID of the account which will be deleted.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async remove(accountId) {
    await this.#accountRepository.delete(accountId);

    return new ApiResponse('Account Deleted Successfully');
  }

  /**
   *
   * @param {string} accountId - The account ID to request pin reset.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async requestPinReset(accountId) {
    const foundAccount = await this.#accountRepository.findById(accountId);
    if (!foundAccount) {
      throw new NotFoundError('Operation failed. Account not found.');
    }

    const foundUser = await this.#userRepository.findById(foundAccount.user_id);

    const otpTimeToLive = 10; // in minutes
    const otp = generateOTP(8, otpTimeToLive);

    await Promise.all([
      this.#tokenRepository.removeByFilter({
        user_id: foundUser.id,
        type: 'pin rest token',
        is_used: false,
      }),

      this.#tokenRepository.insert({
        user_id: foundUser.id,
        token: otp.value,
        type: 'pin rest token',
        expiration_time: otp.expiresIn,
      }),

      await this.#emailService.sendMail({
        to: foundUser.email,
        subject: 'Pin Reset Initiated',
        template: 'request-pin-reset',
        context: {
          name: foundUser.first_name,
          otp: otp.value,
          expiresIn: otpTimeToLive,
        },
      }),
    ]);

    return new ApiResponse(
      'Pin request initiated. Please check your email for OTP to reset pin.',
    );
  }

  /**
   * Gets the balance of the account by ID.
   * @param {string} accountId - The ID of the account to fetch the balance.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   */
  async getBalance(accountId) {
    const { id, balance } = await this.#accountRepository.findById(accountId);

    // Format the amount and balance values with two decimal places and currency symbol
    const nairaSymbol = '\u20A6';
    const formatter = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 });
    const formattedBalance = nairaSymbol.concat(formatter.format(balance));

    const message = `Your account balance is ${formattedBalance}`;

    return new ApiResponse(message, { id, balance: Number(balance) });
  }

  /**
   * Credits an account with a given amount and creates a new transaction record.
   * @param {string} accountId - The ID of the account to credit.
   * @param {import('./dto/credit-account.dto.js').CreditAccountDto} creditAccountDto - The data transfer object for crediting an account.
   * @param {import('objection').Transaction} [t] - An optional Knex transaction object that can be used to perform the account debit as part of a larger transaction.
   * If this parameter is not provided, a new transaction will be created and committed by this method. If this parameter is provided, the caller is responsible for committing or rolling back the transaction.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   * @throws {NotFoundError} if the user account cannot be found.
   * @throws {Error} If any other error occurs while crediting account.
   */
  async credit(accountId, creditAccountDto, t) {
    // Use the provided transaction object or create a new one
    const trx = t !== undefined ? t : await Model.startTransaction();
    try {
      const { amount, description, purpose } = creditAccountDto;

      // Find the account by ID
      const foundAccount = await this.#accountRepository.findById(accountId);
      if (!foundAccount) {
        throw new NotFoundError('Operation failed. Account not found.');
      }

      // Update the account balance by adding the amount
      await foundAccount.$query(trx).increment('balance', amount);

      // Create a new transaction record with type "credit" and purpose "deposit"
      const reference = uuidv4();
      const newTransaction = await this.#transactionRepository.insert(
        {
          account_id: foundAccount.id,
          reference,
          type: TransactionType.CREDIT,
          purpose: purpose || TransactionPurpose.DEPOSIT,
          amount,
          description,
          balance_before: Number(foundAccount.balance),
          balance_after: _.round(Number(foundAccount.balance) + amount, 2),
        },
        trx,
      );

      // Format the amount and balance values with two decimal places and currency symbol
      const nairaSymbol = '\u20A6';
      const formatter = Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
      });
      const formattedAmount = nairaSymbol.concat(formatter.format(amount));
      const formattedBalance = nairaSymbol.concat(
        formatter.format(newTransaction.balance_after),
      );

      const message = `Your account has been credited with ${formattedAmount}. Your new balance is ${formattedBalance}.`;

      // Commit changes if no transaction object is provided.
      if (t === undefined) {
        await trx.commit();
      }

      return new ApiResponse(message, {
        id: foundAccount.id,
        balance: newTransaction.balance_after,
        transaction_reference: reference,
      });
    } catch (error) {
      // Rollback changes if the transaction object is not provided.
      if (t === undefined) {
        await trx.rollback();
      }

      throw error;
    }
  }

  /**
   * Debits an account with a given amount and creates a new transaction record.
   * @param {string} accountId - The ID of the account to credit.
   * @param {import('./dto/debit-account.dto.js').DebitAccountDto} debitAccountDto - The data transfer object for debiting an account.
   * @param {import('objection').Transaction} [t] - An optional Knex transaction object that can be used to perform the account debit as part of a larger transaction.
   * If this parameter is not provided, a new transaction will be created and committed by this method. If this parameter is provided, the caller is responsible for committing or rolling back the transaction.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   * @throws {NotFoundError} if the user account cannot be found.
   * @throws {InsufficientFundsError} if the user account does not have enough balance to complete the transaction.
   * @throws {UnauthorizedError} if the user account pin is incorrect.
   * @throws {Error} If any other error occurs while crediting account.
   */
  async debit(accountId, debitAccountDto, t) {
    // Use the provided transaction object or create a new one
    const trx = t !== undefined ? t : await Model.startTransaction();
    try {
      const { amount, pin, description, purpose } = debitAccountDto;

      // Find the account by ID
      const foundAccount = await this.#accountRepository.findById(accountId);
      if (!foundAccount) {
        throw new NotFoundError('Operation failed. Account not found.');
      }

      // Validate the account pin
      const isValid = bcrypt.compareSync(pin, foundAccount.pin);
      if (!isValid) {
        throw new UnauthorizedError(
          'Your account pin is incorrect. Please try again or reset your pin if you have forgotten it.',
        );
      }

      // Check if the account has sufficient balance
      if (Number(foundAccount.balance) < amount) {
        throw new InsufficientFundsError(
          'Your account balance is insufficient to complete this transaction. Please add funds to your account.',
        );
      }

      // Update the account balance by subtracting the amount
      await foundAccount.$query(trx).decrement('balance', amount);

      // Create a new transaction record with type "debit" and purpose "withdraw"
      const reference = uuidv4();
      const newTransaction = await this.#transactionRepository.insert(
        {
          account_id: foundAccount.id,
          reference,
          type: TransactionType.DEBIT,
          purpose: purpose || TransactionPurpose.WITHDRAWAL,
          amount,
          description,
          destination_account: debitAccountDto.destination_account_id,
          balance_before: Number(foundAccount.balance),
          balance_after: _.round(Number(foundAccount.balance) - amount, 2),
        },
        trx,
      );

      // Format the amount and balance values with two decimal places and currency symbol
      const nairaSymbol = '\u20A6';
      const formatter = Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
      });
      const formattedAmount = nairaSymbol.concat(formatter.format(amount));
      const formattedBalance = nairaSymbol.concat(
        formatter.format(newTransaction.balance_after),
      );

      const message = `Your account has been debited with ${formattedAmount}. Your new balance is ${formattedBalance}.`;

      // Commit changes if no transaction object is provided.
      if (t === undefined) {
        await trx.commit();
      }

      return new ApiResponse(message, {
        id: foundAccount.id,
        balance: newTransaction.balance_after,
        transaction_reference: reference,
      });
    } catch (error) {
      // Rollback changes if the transaction object is not provided.
      if (t === undefined) {
        await trx.rollback();
      }

      throw error;
    }
  }

  /**
   *
   * @param {string} accountId
   * @param {import('./dto/transfer-funds.dto.js').TransferFundsDto} transferFundsDto
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   * @returns
   */
  async transfer(accountId, transferFundsDto) {
    const trx = await Model.startTransaction();
    try {
      const { amount, destination_account_id } = transferFundsDto;
      transferFundsDto.purpose = TransactionPurpose.TRANSFER;

      const [debitResult] = await Promise.all([
        this.debit(accountId, transferFundsDto, trx),
        this.credit(destination_account_id, transferFundsDto, trx),
      ]);

      // Format the amount and balance values with two decimal places and currency symbol
      const nairaSymbol = '\u20A6';
      const formatter = Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
      });
      const formattedAmount = nairaSymbol.concat(formatter.format(amount));
      const formattedBalance = nairaSymbol.concat(
        formatter.format(debitResult.data.balance),
      );

      const message = `You have successfully transferred ${formattedAmount} to ${destination_account_id}. Your new balance is ${formattedBalance}`;

      await trx.commit();

      return new ApiResponse(message, {
        id: accountId,
        destination_account: transferFundsDto.destination_account_id,
        balance: debitResult.data.balance,
        transaction_reference: debitResult.data.transaction_reference,
      });
    } catch (error) {
      await trx.rollback();

      throw error;
    }
  }

  /**
   * Retrieves all transactions of the given account id.
   * @param {string} accountId - The account ID to filter by
   * @param {import('../transaction/dto/transaction-filter.dto.js').TransactionFilter} [filter] - The account ID to filter by. Optional.
   * @returns {Promise<ApiResponse>} A promise that resolves with the ApiResponse object if successful, or rejects if any error occurs.
   * @throws {NotFoundError} if the result array is of length zero.
   */
  async getTransactions(accountId, filter = {}) {
    const foundTransactions = await this.#transactionRepository.find({
      ...filter,
      account_id: accountId,
    });

    if (foundTransactions.length === 0) {
      throw new NotFoundError('No Transactions Found');
    }

    // Format the number of found transactions with commas
    const count = foundTransactions.length;
    const formattedCount = Intl.NumberFormat('en-US').format(
      foundTransactions.length,
    );

    return new ApiResponse(
      `Found ${formattedCount} transaction(s) matching the filter.`,
      foundTransactions,
      { count },
    );
  }
}

export default AccountService;
