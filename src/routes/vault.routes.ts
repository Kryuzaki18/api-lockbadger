import { FastifyInstance } from 'fastify';
import { VaultService, VaultEntryInput } from '../services/vault.service';
import { createEntrySchema, updateEntrySchema, entryParamsSchema } from '../schemas/vault.schema';

interface EntryParams {
  id: string;
}

export default async function vaultRoutes(app: FastifyInstance) {
  const service = new VaultService(app);

  app.addHook('preHandler', app.authenticate);

  app.get('/', async (request) => {
    return service.list(request.authUser!.id);
  });

  app.get<{ Params: EntryParams }>(
    '/:id',
    { schema: entryParamsSchema },
    async (request, reply) => {
      const entry = await service.findOne(request.params.id, request.authUser!.id);
      if (!entry) return reply.code(404).send({ message: 'Entry not found.' });
      return entry;
    },
  );

  app.post<{ Body: VaultEntryInput }>(
    '/',
    { schema: createEntrySchema },
    async (request, reply) => {
      const entry = await service.create(request.authUser!.id, request.body);
      return reply.code(201).send(entry);
    },
  );

  app.patch<{ Params: EntryParams; Body: Partial<VaultEntryInput> }>(
    '/:id',
    { schema: updateEntrySchema },
    async (request, reply) => {
      const entry = await service.update(
        request.params.id,
        request.authUser!.id,
        request.body,
      );
      if (!entry) return reply.code(404).send({ message: 'Entry not found.' });
      return entry;
    },
  );

  app.delete<{ Params: EntryParams }>(
    '/:id',
    { schema: entryParamsSchema },
    async (request, reply) => {
      const deleted = await service.remove(request.params.id, request.authUser!.id);
      if (!deleted) return reply.code(404).send({ message: 'Entry not found.' });
      reply.code(204).send();
    },
  );
}
