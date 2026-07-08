import { FastifyInstance } from 'fastify';
import { ObjectId } from '@fastify/mongodb';
import bcrypt from 'bcrypt';

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export class AuthService {
  constructor(private readonly app: FastifyInstance) {}

  private get users() {
    return this.app.mongo.db!.collection<User>('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ email: email.toLowerCase() });
  }

  async createUser(email: string, password: string): Promise<User> {
    const rounds = parseInt(this.app.config.BCRYPT_ROUNDS, 10);
    const passwordHash = await bcrypt.hash(password, rounds);

    const user: User = {
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
    };

    const result = await this.users.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  signToken(userId: string, email: string): string {
    return this.app.jwt.sign(
      { id: userId, email },
      { expiresIn: this.app.config.JWT_EXPIRY },
    );
  }
}
