import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import { envSchema } from '../config/env';

export default fp(async (app) => {
  await app.register(fastifyEnv, {
    schema: envSchema,
    dotenv: true,
  });
});
