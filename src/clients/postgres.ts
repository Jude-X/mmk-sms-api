/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from "pg";
import { config } from "../config";
import { iDBService } from "../interfaces/iDBService";

export class PgService implements iDBService {
  pgPool: Pool;

  constructor() {
    this.pgPool = new Pool({
      host: config.postgres.host,
      user: config.postgres.user,
      password: config.postgres.password,
      database: config.postgres.name,
      port: config.postgres.port,
      max: 20,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 2000,
    });

    if (this.pgPool) console.log("✅ PostgresDB connection is ready");
  }

  getPhoneNumberId(account_id: string, number: string): Promise<any> {
    const query = `SELECT id FROM phone_number WHERE account_id = $1 AND number = $2`;
    const data = [account_id, number];
    return this.query(query, data);
  }

  getAccountId(username: string, auth_id: string): Promise<any> {
    const query = `SELECT id FROM account WHERE username = $1 AND auth_id = $2`;
    const data = [username, auth_id];
    return this.query(query, data);
  }

  private async query(query: string, data: string[]): Promise<any> {
    try {
      const pgClient = await this.pgPool.connect();

      let result = await pgClient.query(query, data);

      //Release the connection to return to the connection pgPool
      pgClient.release();

      return result.rows;
    } catch (error) {
      console.error("Error while executing query");
    }
  }
}
