const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const foundEnv = dotenv.config();

if (foundEnv.error && process.env.NODE_ENV !== 'production')
    throw new Error('Failed to locate .env file');

const configurations = {
    api: { prefix: '/api', version: '/v1' },
    db: {
        dev: {
            user: process.env.DEV_DB_USER,
            password: process.env.DEV_DB_PASSWORD,
            host: process.env.DEV_DB_HOST,
            port: process.env.DB_PORT,
            name: process.env.DEV_DB_NAME,
        },
        prod: {
            user: process.env.PROD_DB_USER,
            password: process.env.PROD_DB_PASSWORD,
            host: process.env.PROD_DB_HOST,
            port: process.env.DB_PORT,
            name: process.env.PROD_DB_NAME,
        },
        test: {
            user: process.env.DEV_DB_USER,
            password: process.env.DEV_DB_PASSWORD,
            host: process.env.DEV_DB_HOST,
            port: process.env.DB_PORT,
            name: process.env.TEST_DB_NAME,
        },
    },
    jwt: {
        secret: process.env.JWT_ACCESS_KEY,
        exp_time: process.env.JWT_ACCESS_EXP_TIME,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
    },
    name: 'Wallie App',
    port: process.env.PORT,
};

module.exports = configurations;
