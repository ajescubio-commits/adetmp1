
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ClaimsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createClaim(body: any) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO claims (found_id, user_id, claim_date, claim_status) VALUES (?, ?, ?, ?)',
      [
        body.found_id,
        body.user_id,
        body.claim_date,
        body.claim_status || 'Pending',
      ],
    );

    return this.findById(result.insertId);
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM claims',
    );

    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM claims WHERE claim_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Claim not found');
    }

    return rows[0];
  }

  async updateClaim(id: number, body: any) {
    const fields: string[] = [];
    const values: any[] = [];

    if (body.found_id !== undefined) {
      fields.push('found_id = ?');
      values.push(body.found_id);
    }

    if (body.user_id !== undefined) {
      fields.push('user_id = ?');
      values.push(body.user_id);
    }

    if (body.claim_date !== undefined) {
      fields.push('claim_date = ?');
      values.push(body.claim_date);
    }

    if (body.claim_status !== undefined) {
      fields.push('claim_status = ?');
      values.push(body.claim_status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await this.pool().execute(
      `UPDATE claims SET ${fields.join(', ')} WHERE claim_id = ?`,
      values,
    );

    return this.findById(id);
  }

  async deleteClaim(id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM claims WHERE claim_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('Claim not found');
    }

    return { message: 'Claim deleted successfully' };
  }
}
