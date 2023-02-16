const validateId = require('../../../src/middleware/validateId');
const ValidationError = require('../../../src/errors/ValidationError');

describe('validateId middleware', () => {
    it('should not throw an error if id is a positive integer.', () => {
        const req = { params: { id: 1 }, currentUser: { id: 1 } };
        const res = {};
        const next = jest.fn();

        validateId(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it.each([[{ id: -1 }], [{ id: 1.1 }]])(
        'throws a ValidationError if id is not a positive integer.',
        (val) => {
            const req = { params: val };
            const res = {};
            const next = jest.fn();

            expect(() => validateId(req, res, next)).toThrow(ValidationError);
        }
    );

    it('throws a ValidationError if id is not a number.', () => {
        const req = { params: { id: 'id' } };
        const res = {};
        const next = jest.fn();

        expect(() => validateId(req, res, next)).toThrow(ValidationError);
    });
});
