import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default {
  api: { prefix: 'api', version: 'v1' },
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_ACCESS_KEY,
    exp_time: process.env.JWT_ACCESS_EXP_TIME,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },
  port: process.env.PORT,
  salt: process.env.SALT,
};
