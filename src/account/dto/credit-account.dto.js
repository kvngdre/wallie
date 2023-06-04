import { TransactionType } from '../../transaction/jsdoc/transaction.types';

/**
 * @typedef {Object} CreditAccountDto - A data transfer object for crediting a user account.
 * @property {'credit'} type - The transaction type. Must be 'credit'.
 * @property {number} amount - The amount to credit the account with.
 * @property {string} description - The transaction description.
 */
