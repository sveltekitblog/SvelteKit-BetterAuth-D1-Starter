import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const db = (D1: D1Database) => drizzle(D1, { schema });
