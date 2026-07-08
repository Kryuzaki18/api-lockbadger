import { Env } from '../config/env';

export interface AuthUser {
  id: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: Env;
  }

  interface FastifyRequest {
    authUser?: AuthUser;
  }
}
