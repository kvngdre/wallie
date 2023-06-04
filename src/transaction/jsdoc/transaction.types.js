/**
 * The possible values of the type of transaction.
 * @enum {string}
 */
export const TransactionType = {
  DEBIT: 'debit',
  CREDIT: 'credit',
  TRANSFER: 'transfer',
};

/**
 * The possible values of the purpose for the transaction.
 * @enum {string}
 */
export const TransactionPurpose = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
};
