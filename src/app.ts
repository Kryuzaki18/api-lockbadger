import Fastify from 'fastify';

import envPlugin from './plugins/env.plugin';
import securityPlugin from './plugins/security.plugin';
import jwtPlugin from './plugins/jwt.plugin';
import mongodbPlugin from './plugins/mongodb.plugin';

import authRoutes from './routes/auth.routes';
import vaultRoutes from './routes/vault.routes';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env['NODE_ENV'] === 'production' ? 'warn' : 'info',
    },
  });

  await app.register(envPlugin);
  await app.register(securityPlugin);
  await app.register(jwtPlugin);
  await app.register(mongodbPlugin);

  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(vaultRoutes, { prefix: '/api/vault' });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
