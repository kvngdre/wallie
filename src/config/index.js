import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const configurations = {
  api: { prefix: 'api', version: 'v1' },
  db: {
    user: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    host: process.env.DEV_DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DEV_DB_NAME,
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
