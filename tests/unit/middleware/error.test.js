const error = require('../../../src/middleware/error');
const NotFoundError = require('../../../src/errors/NotFoundError');

describe('error middleware', () => {
    it('returns status code 404 , if error is trusted', () => {
        const message = 'resource not found';
        const err = new NotFoundError(message);
        const req = {};
        const next = jest.fn();
        const res = {};
        res.json = jest.fn();
        res.status = jest.fn(() => res);

        error(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, errors: { message } })
        );
    });

    it('returns status code 500, if not a trusted error', () => {
        const err = new Error('Not trusted error');
        const req = {};
        const next = jest.fn();
        const res = {};
        res.json = jest.fn();
        res.status = jest.fn(() => res);

        error(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                errors: { message: 'Something went wrong' },
            })
        );
    });
});
