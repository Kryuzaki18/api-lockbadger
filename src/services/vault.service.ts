import { FastifyInstance } from 'fastify';
import { ObjectId } from '@fastify/mongodb';
import { encrypt, decrypt } from '../modules/vault.crypto';

export interface VaultEntryRaw {
  _id?: ObjectId;
  userId: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaultEntryInput {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export class VaultService {
  constructor(private readonly app: FastifyInstance) { }

  private get collection() {
    return this.app.mongo.db!.collection<VaultEntryRaw>('vault_entries');
  }

  private get secret(): string {
    return this.app.config.JWT_SECRET;
  }

  private encryptEntry(input: VaultEntryInput): Pick<VaultEntryRaw, 'username' | 'password' | 'notes'> {
    return {
      username: encrypt(input.username, this.secret),
      password: encrypt(input.password, this.secret),
      notes: input.notes ? encrypt(input.notes, this.secret) : undefined,
    };
  }

  private decryptEntry(raw: VaultEntryRaw): VaultEntryInput & { id: string; title: string; url?: string; createdAt: Date; updatedAt: Date } {
    return {
      id: raw._id!.toString(),
      title: raw.title,
      username: decrypt(raw.username, this.secret),
      password: decrypt(raw.password, this.secret),
      url: raw.url,
      notes: raw.notes ? decrypt(raw.notes, this.secret) : undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  async list(userId: string) {
    const entries = await this.collection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
    return entries.map((e) => this.decryptEntry(e));
  }

  async findOne(id: string, userId: string) {
    const entry = await this.collection.findOne({
      _id: new ObjectId(id),
      userId,
    });
    return entry ? this.decryptEntry(entry) : null;
  }

  async create(userId: string, input: VaultEntryInput) {
    const now = new Date();
    const encrypted = this.encryptEntry(input);

    const doc: VaultEntryRaw = {
      userId,
      title: input.title,
      ...encrypted,
      url: input.url,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(doc);
    return this.decryptEntry({ ...doc, _id: result.insertedId });
  }

  async update(id: string, userId: string, input: Partial<VaultEntryInput>) {
    const fields: Partial<VaultEntryRaw> = { updatedAt: new Date() };

    if (input.title) fields.title = input.title;
    if (input.url !== undefined) fields.url = input.url;
    if (input.username) fields.username = encrypt(input.username, this.secret);
    if (input.password) fields.password = encrypt(input.password, this.secret);
    if (input.notes !== undefined) {
      fields.notes = input.notes ? encrypt(input.notes, this.secret) : undefined;
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: fields },
      { returnDocument: 'after' },
    );

    return result ? this.decryptEntry(result) : null;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({
      _id: new ObjectId(id),
      userId,
    });
    return result.deletedCount === 1;
  }
}
