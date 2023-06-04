import { TransactionType } from '../../transaction/jsdoc/transaction.types.js';

/**
 * @typedef {Object} DebitAccountDto - A data transfer object for crediting a user account.
 * @property {'debit'} type - The transaction type. Must be 'debit'.
 * @property {number} amount - The amount to credit the account with.
 * @property {string} description - The transaction description.
 * @property {string} pin - The account pin.
 */
