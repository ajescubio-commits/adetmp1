
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class LostItemService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createLostItem(body: any) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO lost_item (user_id, item_name, description, lost_location, lost_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [
        body.user_id,
        body.item_name,
        body.description,
        body.lost_location,
        body.lost_date,
        body.status || 'Lost',
      ],
    );

    return this.findById(result.insertId);
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM lost_item',
    );

    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM lost_item WHERE lost_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Lost item not found');
    }

    return rows[0];
  }

  async updateLostItem(id: number, body: any) {
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

    if (body.lost_location !== undefined) {
      fields.push('lost_location = ?');
      values.push(body.lost_location);
    }

    if (body.lost_date !== undefined) {
      fields.push('lost_date = ?');
      values.push(body.lost_date);
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
      `UPDATE lost_item SET ${fields.join(', ')} WHERE lost_id = ?`,
      values,
    );

    return this.findById(id);
  }

  async deleteLostItem(id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM lost_item WHERE lost_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('Lost item not found');
    }

    return { message: 'Lost item deleted successfully' };
  }
}
