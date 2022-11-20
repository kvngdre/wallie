const accountValidators = require('../../../validators/account.validator');

describe('validateAmount', () => {
    it('should return an object without the property "error", if input is positive.', () => {
        const result = accountValidators.validateAmount(100);
        expect(result).not.toHaveProperty('error');
    });

    it.each([[0], [-1], ['k'], [true]])(
        'should return an object with property "error", if input(%s) is not a positive number.',
        (val) => {
            const result = accountValidators.validateAmount(val);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeDefined();
        }
    );
});

describe('validateCreate', () => {
    it('should return an object without property "error", if input has property "userId" only.', () => {
        const result = accountValidators.validateCreate({ userId: 1 });
        expect(result).not.toHaveProperty('error');
    });

    it.each([
        [{ UserId: -1 }],
        [{ userId: 'a' }],
        [{ name: 'Jack' }],
        [{ userId: 1, name: 'Jack' }],
    ])(
        'should return an object with property "error", if input(%s) does not pass validation.',
        (val) => {
            const result = accountValidators.validateCreate(val);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeDefined();
        }
    );
});

describe('validateTransfer', () => {
    it('should return an object without property "error", if input has properties "amount" and "destinationAccountId" only.', () => {
        const result = accountValidators.validateTransfer({
            amount: 100,
            destinationAccountId: 1,
        });
        expect(result).not.toHaveProperty('error');
    });

    it.each([
        [{ amount: 100 }],
        [{ destinationAccountId: 1 }],
        [{ amount: 'hi', destinationAccountId: -1 }],
        [{ amount: 100, destinationAccountId: 1, name: 'Jack' }],
    ])(
        'should return an object with property "error", if input(%s) fails validation.',
        (val) => {
            const result = accountValidators.validateTransfer(val);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeDefined();
        }
    );
});
