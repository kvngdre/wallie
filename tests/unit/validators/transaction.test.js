const { txnPurposes, txnTypes } = require('../../../src/utils/constants');
const txnValidators = require('../../../src/validators/transaction.validator');

describe('New transaction validator function', () => {
    it('does not return error when input contains required fields', () => {
        const testBody = {
            account_id: 1,
            type: txnTypes.CREDIT,
            purpose: txnPurposes.DEPOSIT,
            amount: 1,
            description: 'a',
            bal_before: 0,
            bal_after: 1,
        };

        const result = txnValidators.validateNewTxnDto(testBody);
        expect(result).not.toHaveProperty('error');
    });

    it('returns error when input is missing a required fields(account_id, type, purpose, amount, bal_before, bal_after).', () => {
        const testBody = {
            account_id: 1,
            amount: 1,
            bal_before: 1,
            bal_after: 2,
        };

        const result = txnValidators.validateNewTxnDto(testBody);
        expect(result).toHaveProperty('error');
        expect(result.error).toBeDefined();
    });
});

describe('Update transaction validator function', () => {
    it('does not return error when input contains mutable fields only.', () => {
        const testBody = { description: 'a' };

        const result = txnValidators.validateUpdateTxnDto(testBody);
        expect(result).not.toHaveProperty('error');
    });

    it('returns error when any immutable field is included', () => {
        const testBody = {
            amount: 2,
        };

        const result = txnValidators.validateUpdateTxnDto(testBody);
        expect(result).toHaveProperty('error');
        expect(result.error.details).toBeDefined();
    });
});
