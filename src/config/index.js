import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
  dotenv.config();
} else {
  dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
}

export default {
  api: { baseUrl: process.env.BASE_URL, version: process.env.VERSION },
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: {
      signUP: process.env.JWT_SIGN_UP_TOKEN_SECRET,
      access: process.env.JWT_ACCESS_TOKEN_SECRET,
      refresh: process.env.JWT_REFRESH_TOKEN_SECRET,
    },
    expireTime: {
      signUp: process.env.JWT_SIGN_UP_TOKEN_EXPIRE_TIME,
      access: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
      refresh: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
    },
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },
  port: process.env.PORT,
  saltRounds: parseInt(process.env.SALT_ROUNDS),
};
