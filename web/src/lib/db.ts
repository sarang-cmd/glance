import { Pool } from '@neondatabase/serverless';

/** Minimal query interface so tests can substitute an in-memory Postgres. */
export interface Queryable {
  query(text: string, params: unknown[]): Promise<{ rows: Record<string, unknown>[]; rowCount: number | null }>;
}

let pool: Pool | null = null;

export class DatabaseNotConfigured extends Error {
  constructor() {
    super('DATABASE_URL is not set');
    this.name = 'DatabaseNotConfigured';
  }
}

export function getQueryable(): Queryable {
  const url = process.env.DATABASE_URL;
  if (!url) throw new DatabaseNotConfigured();
  if (!pool) pool = new Pool({ connectionString: url });
  return pool as unknown as Queryable;
}
