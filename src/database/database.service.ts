
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { Pool } from 'mysql2/promise';
import { readFileSync } from 'fs';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool!: Pool;
  async onModuleInit() {
    const sslCaPath = process.env.DB_SSL_CA_PATH;

    const sslConfig = sslCaPath
      ? {
          ca: readFileSync(sslCaPath, 'utf8'),
        }
      : undefined;

    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 30000,
      ssl: sslConfig,
    });

    await this.pool.query('SELECT 1');

    console.log('MySQL Database Connected Successfully!');
  }

  getPool(): Pool {
    return this.pool;
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      console.log('MySQL Database Connection Closed!');
    }
  }
}
