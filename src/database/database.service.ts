
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  pool!: mysql.Pool;

  async onModuleInit() {
    this.pool = mysql.createPool({
      host:
        process.env.DB_HOST ||
        'mysql-361cb7c3-escubiop4.a.aivencloud.com',

      port: +(process.env.DB_PORT || 19164),
      user: process.env.DB_USER || 'avnadmin',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'defaultdb',

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,

      ssl: {
        rejectUnauthorized: true,
      },
    });

    const conn = await this.pool.getConnection();
    await conn.ping();
    conn.release();

    console.log('MySQL pool created');
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  getPool(): mysql.Pool {
    return this.pool;
  }
}
