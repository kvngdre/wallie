const APIError = require('../../../src/errors/APIError');
const validateId = require('../../../src/middleware/validateId');

describe('validateId middleware', () => {
    it('should not throw an error if id is a positive integer', () => {
        const req = { params: { id: 1 }, currentUser: { id: 1 } };
        const res = {};
        const next = jest.fn();

        validateId(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it.each([[{ id: -1 }], [{ id: 1.1 }]])(
        'should throw an APIError if id is not a positive integer',
        (val) => {
            const req = { params: val };
            const res = {};
            const next = jest.fn();

            expect(() => validateId(req, res, next)).toThrow(APIError);
        }
    );

    it('should throw an APIError if id is not a number.', () => {
        const req = { params: { id: 'id' } };
        const res = {};
        const next = jest.fn();

        expect(() => validateId(req, res, next)).toThrow(APIError);
    });
});
