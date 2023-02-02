const accountValidators = require('../../../src/validators/account.validator');

describe('New account validator function', () => {
    it('does not return error when input contains required fields(pin).', () => {
        const testBody = { pin: '1234' };

        const result = accountValidators.validateNewAccountDto(testBody);
        expect(result).not.toHaveProperty('error');
    });

    it('returns error when input is a missing required field(pin).', () => {
        const testBody = {};

        const result = accountValidators.validateNewAccountDto(testBody);
        expect(result).toHaveProperty('error');
        expect(result.error).toBeDefined();
    });
});

describe('Credit account validator function', () => {
    it('does not return error when input contains required field(amount) and is a positive number.', () => {
        const testBody = { amount: 1, desc: 'a' };

        const result = accountValidators.validateCreditAccountDto(testBody);
        expect(result).not.toHaveProperty('error');
    });

    it.each([[{ desc: 'a' }], [{ amount: -1, desc: 'a' }]])(
        'returns error when input is missing required field(amount) or amount field is not a positive number.',
        (val) => {
            const result = accountValidators.validateCreditAccountDto(val);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeDefined();
        }
    );
});

describe('Debit account validator function', () => {
    it('does not return error when input contains required fields(amount, pin).', () => {
        const result = accountValidators.validateDebitAccountDto({
            amount: 1,
            pin: '1234',
            desc: 'a',
        });
        expect(result).not.toHaveProperty('error');
    });

    it.each([[{ desc: 'a' }], [{ pin: '1234' }]])(
        'returns error when input is missing a required field.',
        (val) => {
            const result = accountValidators.validateDebitAccountDto(2, val);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeDefined();
        }
    );
});

describe('transfer funds validator function', () => {
    it('does not return error when input contains required fields(amount, pin, dest_id) and the currentUser id is not equal to dest_id.', () => {
        const testBody = {
            amount: 1,
            pin: '1234',
            dest_id: 1,
            desc: 'a',
        };
        const currentUser = { id: 2 };

        const result = accountValidators.validateTransferDto(
            testBody,
            currentUser
        );
        expect(result).not.toHaveProperty('error');
    });

    it('returns error when input is missing a required field and/or currentUser id is equal to dest_id ', () => {
        const testBody = { pin: '0000', amount: 1 };
        const currentUser = { id: 1 };

        const result = accountValidators.validateTransferDto(
            testBody,
            currentUser
        );
        expect(result).toHaveProperty('error');
        expect(result.error).toBeDefined();
    });
});
