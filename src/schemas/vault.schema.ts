import { FastifySchema } from 'fastify';

export const createEntrySchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['title', 'username', 'password'],
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 200 },
      username: { type: 'string' },
      password: { type: 'string', minLength: 1 },
      url: { type: 'string' },
      notes: { type: 'string' },
    },
    additionalProperties: false,
  },
};

export const updateEntrySchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 200 },
      username: { type: 'string' },
      password: { type: 'string', minLength: 1 },
      url: { type: 'string' },
      notes: { type: 'string' },
    },
    additionalProperties: false,
  },
};

export const entryParamsSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};
