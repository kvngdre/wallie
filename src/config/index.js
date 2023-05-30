import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
  dotenv.config();
} else {
  dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
}

export default {
  api: { prefix: 'api', version: 'v1' },
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: {
      access: process.env.JWT_ACCESS_TOKEN_SECRET,
      refresh: process.env.JWT_REFRESH_TOKEN_SECRET,
    },
    expireTime: {
      access: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
      refresh: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
    },
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },
  port: process.env.PORT,
  saltRounds: process.env.SALT_ROUNDS,
};
