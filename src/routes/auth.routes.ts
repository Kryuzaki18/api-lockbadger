import { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service';
import { signUpSchema, signInSchema } from '../schemas/auth.schema';
import { STORAGE_KEYS } from '../constants/storage.constant';

interface SignUpBody {
  email: string;
  password: string;
}

interface SignInBody {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default async function authRoutes(app: FastifyInstance) {
  const service = new AuthService(app);

  app.post<{ Body: SignUpBody }>(
    '/signup',
    { schema: signUpSchema },
    async (request, reply) => {
      const { email, password } = request.body;

      const existing = await service.findByEmail(email);
      if (existing) {
        return reply.code(409).send({ message: 'Email already in use.' });
      }

      const user = await service.createUser(email, password);
      const token = service.signToken(user._id!.toString(), user.email);

      reply
        .setCookie(STORAGE_KEYS.ACCESS_TOKEN, token, {
          httpOnly: true,
          secure: app.config.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        })
        .code(201)
        .send({
          id: user._id!.toString(),
          email: user.email,
          createdAt: user.createdAt,
        });
    },
  );

  app.post<{ Body: SignInBody }>(
    '/login',
    { schema: signInSchema },
    async (request, reply) => {
      const { email, password, rememberMe } = request.body;

      const user = await service.findByEmail(email);
      if (!user) {
        return reply.code(401).send({ message: 'Invalid credentials.' });
      }

      const valid = await service.verifyPassword(password, user.passwordHash);
      if (!valid) {
        return reply.code(401).send({ message: 'Invalid credentials.' });
      }

      const token = service.signToken(user._id!.toString(), user.email);
      const maxAge = rememberMe ? 60 * 60 * 24 * 7 : undefined;

      reply
        .setCookie(STORAGE_KEYS.ACCESS_TOKEN, token, {
          httpOnly: true,
          secure: app.config.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge,
        })
        .send({
          id: user._id!.toString(),
          email: user.email,
          createdAt: user.createdAt,
        });
    },
  );

  app.post(
    '/logout',
    { preHandler: [app.authenticate] },
    async (_request, reply) => {
      reply
        .clearCookie(STORAGE_KEYS.ACCESS_TOKEN, { path: '/' })
        .send({ message: 'Logged out.' });
    },
  );

  app.get(
    '/me',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const user = await service.findByEmail(request.authUser!.email);
      if (!user) {
        return reply.code(404).send({ message: 'User not found.' });
      }
      reply.send({
        id: user._id!.toString(),
        email: user.email,
        createdAt: user.createdAt,
      });
    },
  );
}
