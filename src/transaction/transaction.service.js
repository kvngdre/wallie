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

  async getTransactions(currentUser) {
    const queryObj = {};

    if (currentUser.role !== 'admin')
      queryObj['account.user_id'] = currentUser.id;

    const foundTransactions = await TransactionRepository.findAll(queryObj);
    const count = Intl.NumberFormat('en-US').format(foundTransactions.length);

    return { count, foundTransactions };
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
