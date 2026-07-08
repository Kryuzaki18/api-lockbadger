import fp from 'fastify-plugin';
import fastifyMongodb from '@fastify/mongodb';

export default fp(async (app) => {
  await app.register(fastifyMongodb, {
    forceClose: true,
    url: app.config.MONGODB_URL,
  });
});
