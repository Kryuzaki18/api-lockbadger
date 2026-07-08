import fp from 'fastify-plugin';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';

export default fp(async (app) => {
  await app.register(fastifyCors, {
    origin: app.config.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await app.register(fastifyHelmet);

  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(fastifyCookie, {
    secret: app.config.COOKIE_SECRET,
  });

  await app.register(fastifyCsrf, {
    sessionPlugin: '@fastify/cookie',
  });
});
