import { FastifySchema } from 'fastify';

export const signUpSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
    },
    additionalProperties: false,
  },
};

export const signInSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
      rememberMe: { type: 'boolean', default: false },
    },
    additionalProperties: false,
  },
};
