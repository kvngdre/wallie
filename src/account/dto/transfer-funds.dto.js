import { TransactionType } from '../../transaction/jsdoc/transaction.types.js';

/**
 * @typedef {Object} TransferFundsDto - A data transfer object for crediting a user account.
 * @property {'transfer'} type - The transaction type. Must be 'transfer'.
 * @property {'transfer'} [purpose] - The transaction type. Must be 'transfer'.
 * @property {string} destination_account -
 * @property {number} amount - The amount to credit the account with.
 * @property {string} [description] - The transaction description.
 * @property {string} pin - The account pin.
 */
