const userValidators = require('../../../src/validators/user.validator');

describe('New user validator function', () => {
    it('does not return error when input is not missing a required field.', () => {
        const testBody = {
            first_name: 'John',
            last_name: 'Sparrow',
            email: 'example@email.com',
            password: 'Password1!',
        };

        const result = userValidators.validateNewUserDto(testBody);
        expect(result).not.toHaveProperty('error');
    });

    it('returns error when password field does not match pattern.', () => {
        /**
         * Password pattern
         * 1. must contain a capital letter
         * 2. must have at least one number
         * 3. must have at least one special character
         * 4. must not contain with spaces
         */
        const testBody = {
            first_name: 'John',
            last_name: 'Sparrow',
            email: 'example@email.com',
            password: 'Password1',
        };

        const result = userValidators.validateNewUserDto(testBody);
        expect(result).toHaveProperty('error');
        expect(result.error).toBeDefined();
    });

    it.each([
        [{ first_name: 'John', last_name: 'Sparrow' }],
        [{ first_name: 1, last_name: 'Sparrow', password: 'Password1' }],
    ])('returns error when input is missing a required field.', (val) => {
        const result = userValidators.validateNewUserDto(val);
        expect(result).toHaveProperty('error');
        expect(result.error).toBeDefined();
    });
});

describe('Update user validator function', () => {
    it('does not return error when input contains mutable fields only', () => {
        const testBody = { first_name: 'Jon', last_name: 'Snow' };

        const result = userValidators.validateUpdateUserDto(testBody);
        expect(result).not.toHaveProperty('error');
    });

    it('returns error when input contains an immutable field(email, password).', () => {
        const testBody = { email: 'example1@email.com' };

        const result = userValidators.validateUpdateUserDto(testBody);
        expect(result).toHaveProperty('error');
        expect(result.error).toBeDefined();
    });
});

describe('User sign in validator function', () => {
    it('does not return error when input contains required fields(email, password).', () => {
        const testBody = {
            email: 'email@example.com',
            password: 'password',
        };

        const result = userValidators.validateUserSignInDto(testBody);
        expect(result).not.toHaveProperty('error');
    });

    it.each([[{ email: 'example@email.com' }], [{ password: 'password' }]])(
        'returns error when input is missing a required field(email, password).',
        (testBody) => {
            const result = userValidators.validateUserSignInDto(testBody);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeDefined();
        }
    );
});
