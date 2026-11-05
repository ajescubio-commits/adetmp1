
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class FoundItemService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createFoundItem(body: any) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO found_item (user_id, item_name, description, found_location, found_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [
        body.user_id,
        body.item_name,
        body.description,
        body.found_location,
        body.found_date,
        body.status || 'Found',
      ],
    );

    return this.findById(result.insertId);
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM found_item',
    );

    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM found_item WHERE found_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Found item not found');
    }

    return rows[0];
  }

  async updateFoundItem(id: number, body: any) {
    const fields: string[] = [];
    const values: any[] = [];

    if (body.user_id !== undefined) {
      fields.push('user_id = ?');
      values.push(body.user_id);
    }

    if (body.item_name !== undefined) {
      fields.push('item_name = ?');
      values.push(body.item_name);
    }

    if (body.description !== undefined) {
      fields.push('description = ?');
      values.push(body.description);
    }

    if (body.found_location !== undefined) {
      fields.push('found_location = ?');
      values.push(body.found_location);
    }

    if (body.found_date !== undefined) {
      fields.push('found_date = ?');
      values.push(body.found_date);
    }

    if (body.status !== undefined) {
      fields.push('status = ?');
      values.push(body.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await this.pool().execute(
      `UPDATE found_item SET ${fields.join(', ')} WHERE found_id = ?`,
      values,
    );

    return this.findById(id);
  }

  async deleteFoundItem(id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM found_item WHERE found_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('Found item not found');
    }

    return { message: 'Found item deleted successfully' };
  }
}
