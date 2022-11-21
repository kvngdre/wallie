const userValidators = require('../../../validators/user.validator');

describe('validateCreate', () => {
    it('should return an object without property "error", if input passes validation.', () => {
        const userDto = {
            firstName: 'Jack',
            lastName: 'Bo',
            email: 'e@example.com',
            password: 'Password1!',
        };
        const result = userValidators.validateCreate(userDto);
        expect(result).not.toHaveProperty('error');
    });

    it.each([
        [{ firstName: 'Jack', email: 'e@example.com', password: 'Password1!' }],
        [{ firstName: 1, lastName: 2, email: 'e@.com', password: true }],
    ])(
        'should return an object with property "error", if input does not pass validation.',
        (val) => {
            const result = userValidators.validateCreate(val);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeDefined();
        }
    );

    it.each([
        [
            {
                password: 'Password1',
                firstName: 'Jack',
                lastName: 'Bo',
                email: 'e@example.com',
            },
            {
                password: 'password!',
                firstName: 'Jack',
                lastName: 'Bo',
                email: 'e@example.com',
            },
        ],
    ])(
        'should return an object with property "error", if input property "password" does not satisfy all criteria ',
        (val) => {
            /**
             * Password criteria
             * 1. should contain a capital letter
             * 2. should have at least one number
             * 3. should have at least one special character
             * 4. should not contain with spaces
             */
            const result = userValidators.validateCreate(val);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeDefined();
        }
    );
});

describe('validateEdit', () => {
    it('should return an object without property "error", ïf input passes validation.', () => {
        const result = userValidators.validateEdit({
            firstName: 'Jack',
            lastName: 'Bo',
        });
        expect(result).not.toHaveProperty('error');
    });

    it.each([[{ firstName: true }], [{ lastName: -1, password: 'p@ssword2' }]])(
        'should return an object with property "error", if input does not pass validation.',
        (val) => {
            const result = userValidators.validateEdit(val);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeDefined();
        }
    );
});

describe('validateLogin', () => {
    it('should return an object without property "error", ïf input passes validation.', () => {
        const result = userValidators.validateLogin({
            email: 'email@example.com',
            password: 'password',
        });
        expect(result).not.toHaveProperty('error');
    });

    it('should return an object with property "error", ïf input does not pass validation.', () => {
        const result = userValidators.validateLogin({
            email: 'email@examplecom',
            password: 11132,
        });
        expect(result).toHaveProperty('error');
        expect(result.error).toBeDefined();
    });
});
