
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createUser(
    username: string,
    password: string,
    role = 'user',
    first_name?: string,
    last_name?: string,
    course?: string,
    year_level?: number,
    phone?: string,
  ) {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO users
      (username, password, role, first_name, last_name, course, year_level, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        hashed,
        role,
        first_name || null,
        last_name || null,
        course || null,
        year_level || null,
        phone || null,
      ],
    );

    return this.findById(result.insertId);
  }

  async findByUsername(username: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, username, password, role, refresh_token FROM users WHERE username = ?',
      [username],
    );

    return rows[0];
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, username, first_name, last_name, course, year_level, phone, role, created_at FROM users WHERE user_id = ?',
      [id],
    );

    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, username, first_name, last_name, course, year_level, phone, role, created_at FROM users',
    );

    return rows;
  }

  async updateUser(id: number, partial: {
    username?: string;
    password?: string;
    role?: string;
    first_name?: string;
    last_name?: string;
    course?: string;
    year_level?: number;
    phone?: string;
  }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.username !== undefined) {
      fields.push('username = ?');
      values.push(partial.username);
    }

    if (partial.password !== undefined) {
      const hashed = await bcrypt.hash(partial.password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }

    if (partial.role !== undefined) {
      fields.push('role = ?');
      values.push(partial.role);
    }

    if (partial.first_name !== undefined) {
      fields.push('first_name = ?');
      values.push(partial.first_name);
    }

    if (partial.last_name !== undefined) {
      fields.push('last_name = ?');
      values.push(partial.last_name);
    }

    if (partial.course !== undefined) {
      fields.push('course = ?');
      values.push(partial.course);
    }

    if (partial.year_level !== undefined) {
      fields.push('year_level = ?');
      values.push(partial.year_level);
    }

    if (partial.phone !== undefined) {
      fields.push('phone = ?');
      values.push(partial.phone);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await this.pool().execute(
      `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
      values,
    );

    return this.findById(id);
  }

  async deleteUser(id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM users WHERE user_id = ?',
      [id],
    );

    return result.affectedRows > 0;
  }

  async setRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE users SET refresh_token = ? WHERE user_id = ?',
      [refreshToken, id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, username, role FROM users WHERE refresh_token = ?',
      [refreshToken],
    );

    return rows[0];
  }
}
