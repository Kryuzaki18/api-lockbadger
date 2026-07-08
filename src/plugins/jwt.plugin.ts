import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
    cookie: {
      cookieName: 'access_token',
      signed: false,
    },
  });

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const payload = await request.jwtVerify<{ id: string; email: string }>();
      request.authUser = { id: payload.id, email: payload.email };
    } catch {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
