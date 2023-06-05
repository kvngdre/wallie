import { v4 as uuidv4 } from 'uuid';
import pubsub from '../pubsub/PubSub.js';
import events from '../pubsub/events.js';
import TransactionRepository from './transaction.repository.js';

class TransactionService {
  #generateReference;
  #transactionRepository;

  /**
   *
   * @param {TransactionRepository} transactionRepository
   */
  constructor(transactionRepository) {
    this.#transactionRepository = transactionRepository;

    this.#generateReference = () => uuidv4();

    // Event subscriptions
    pubsub.subscribe(events.account.credit, this.createTransaction);
    pubsub.subscribe(events.account.debit, this.createTransaction);
  }

  create = async (newTransactionDto, trx) => {
    if (!newTransactionDto.reference)
      newTransactionDto.reference = this.#generateReference();
    const newTransaction = await this.#transactionRepository.insert(
      newTransactionDto,
      trx,
    );

    return newTransaction;
  };

  async get(filter) {
    const foundTransactions = await TransactionRepository.find(filter);

    if (foundTransactions.length === 0)
      throw new NotFoundError('No Users Found');

    // Format the number of found transactions with commas
    const count = foundUsers.length;
    const formattedCount = Intl.NumberFormat('en-US').format(count);

    return new ApiResponse(
      `Found ${count} transaction(s) matching the filter.`,
      foundTransactions,
      { count: formattedCount },
    );
  }

  async getTransaction(currentUserId, txnId) {
    const queryObj = {
      'transactions.id': txnId,
      'account.user_id': currentUserId,
    };
    const foundTransaction = await TransactionRepository.findOne(queryObj);

    return foundTransaction;
  }

  async updateTransaction(txnId, updateTxnDto) {
    const updatedTransaction = await TransactionRepository.update(
      txnId,
      updateTxnDto,
    );

    return updatedTransaction;
  }

  async deleteTransaction(txnId) {
    return await TransactionRepository.delete(txnId);
  }
}

export default TransactionService;
