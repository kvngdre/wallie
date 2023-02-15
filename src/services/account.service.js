const { Model } = require('objection');
const { txnPurposes, txnTypes } = require('../utils/constants');
const AccountDAO = require('../daos/account.dao');
const ConflictException = require('../errors/ConflictError');
const events = require('../pubsub/events');
const InsufficientFundsException = require('../errors/InsufficientFundsError');
const logger = require('../loaders/logger');
const pubsub = require('../pubsub/PubSub');
const roles = require('../utils/userRoles');
const UnauthorizedException = require('../errors/UnauthorizedError');

class AccountService {
    async createAccount(newAccountDto, currentUser) {
        newAccountDto.user_id = currentUser.id;

        const newAccount = await AccountDAO.insert(newAccountDto);
        newAccount.omitPin();

        return newAccount;
    }

    async getAccounts() {
        const foundAccounts = await AccountDAO.findAll();
        const count = Intl.NumberFormat('en-US').format(foundAccounts.length);

        // Modifying accounts array inplace to omit account pin.
        foundAccounts.forEach((acc) => acc.omitPin());

        return { count, foundAccounts };
    }

    async getAccount(accountId) {
        const foundAccount = await AccountDAO.findById(accountId);
        foundAccount.omitPin();

        return foundAccount;
    }

    async updateAccount(currentUser, accountId, updateAccountDto) {
        if (currentUser.id !== user_id && currentUser.role !== roles.admin)
            throw new ConflictException('Cannot perform operation.');

        const updatedAccount = await AccountDAO.update(
            accountId,
            updateAccountDto
        );
        updatedAccount.omitPin();

        return updatedAccount;
    }

    async deleteAccount(accountId) {
        return await AccountDAO.delete(accountId);
    }

    async getBalance(currentUser) {
        const { balance } = await AccountDAO.findOne({
            user_id: currentUser.id,
        });

        return { balance };
    }

    async creditAccount(currentUser, fundAccountDto) {
        try {
            const updatedAccount = await Model.transaction(async (trx) => {
                const foundAccount = await AccountDAO.findOne({
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
                        txnTypes.CREDIT,
                        txnPurposes.DEPOSIT,
                        amount,
                        desc,
                        balance
                    ),
                    trx
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
                const foundAccount = await AccountDAO.findOne({
                    user_id: currentUser.id,
                });

                const { amount, desc, pin } = debitAccountDto;
                const { id, balance, comparePins, omitPin } = foundAccount;

                const isMatch = comparePins(pin);
                if (!isMatch) throw new UnauthorizedException('Invalid pin');
                else omitPin();

                logger.silly('Pin ok, performing transaction.');
                await decrementBalance(foundAccount, amount, trx);

                // Emitting onAccountDebit event.
                await pubsub.publish(
                    events.account.debit,
                    new NewTransaction(
                        id,
                        txnTypes.DEBIT,
                        txnPurposes.WITHDRAW,
                        amount,
                        desc,
                        balance
                    ),
                    trx
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
                const { findById, findOne } = AccountDAO;
                const { amount, desc, dest_id, pin, src_id } = transferFundsDto;

                const [sourceAccount, destinationAccount] = await Promise.all([
                    findOne(
                        { user_id: currentUserId },
                        'Source account not found.'
                    ),
                    findById(dest_id, 'Destination account not found.'),
                ]);

                await debitSourceAndEmitEvent(pin);
                async function debitSourceAndEmitEvent(pin) {
                    const { id, balance, comparePins, omitPin } = sourceAccount;

                    const isMatch = comparePins(pin);
                    if (!isMatch)
                        throw new UnauthorizedException('Invalid pin');
                    else omitPin();

                    // Debit source account
                    logger.silly('Pin ok, debiting source account.');
                    await decrementBalance(sourceAccount, amount, trx);

                    // Emitting onAccountDebit event.
                    await pubsub.publish(
                        events.account.debit,
                        new NewTransaction(
                            id,
                            txnTypes.DEBIT,
                            txnPurposes.TRANSFER,
                            amount,
                            desc,
                            balance
                        ),
                        trx
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
                            txnTypes.CREDIT,
                            txnPurposes.TRANSFER,
                            amount,
                            desc,
                            balance
                        ),
                        trx
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
    const { balance } = account;
    if (balance < amount)
        throw new InsufficientFundsException('Insufficient funds');

    await account.$query(trx).patch({ balance: Number(balance - amount) });
}

async function incrementBalance(account, amount, trx) {
    const { balance } = account;

    await account.$query(trx).patch({ balance: Number(balance) + amount });
}

function NewTransaction(id, type, purpose, amount, desc, balance) {
    this.account_id = id;
    this.type = type;
    this.purpose = purpose;
    this.amount = amount;
    this.description = desc;
    this.bal_before = Number(balance);
    this.bal_after =
        type === txnTypes.DEBIT
            ? Number(balance) - amount
            : Number(balance) + amount;
}

module.exports = new AccountService();
