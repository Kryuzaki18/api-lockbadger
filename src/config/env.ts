export const envSchema = {
  type: 'object',
  required: ['MONGODB_URL', 'JWT_SECRET', 'COOKIE_SECRET'],
  properties: {
    NODE_ENV: {
      type: 'string',
      default: 'development',
      enum: ['development', 'production', 'test'],
    },
    PORT: { type: 'string', default: '3000' },
    HOST: { type: 'string', default: '0.0.0.0' },
    MONGODB_URL: { type: 'string' },
    JWT_SECRET: { type: 'string' },
    JWT_EXPIRY: { type: 'string', default: '15m' },
    JWT_REFRESH_EXPIRY: { type: 'string', default: '7d' },
    BCRYPT_ROUNDS: { type: 'string', default: '12' },
    COOKIE_SECRET: { type: 'string' },
    CORS_ORIGIN: { type: 'string', default: 'http://localhost:4200' },
  },
};

export interface Env {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: string;
  HOST: string;
  MONGODB_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRY: string;
  JWT_REFRESH_EXPIRY: string;
  BCRYPT_ROUNDS: string;
  COOKIE_SECRET: string;
  CORS_ORIGIN: string;
}
