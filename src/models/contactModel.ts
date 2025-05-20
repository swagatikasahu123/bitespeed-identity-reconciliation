import { pool } from '../db';

export async function findContactsByEmailOrPhone(email: string, phone: string) {
  const result = await pool.query(
    `SELECT * FROM Contact WHERE email = $1 OR phoneNumber = $2`,
    [email, phone]
  );
  return result.rows;
}

export async function createContact(email: string, phone: string, linkedId: number | null, precedence: 'primary' | 'secondary') {
  const result = await pool.query(
    `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES ($1, $2, $3, $4) RETURNING *`,
    [email, phone, linkedId, precedence]
  );
  return result.rows[0];
}

export async function findContactById(id: number) {
  const result = await pool.query(`SELECT * FROM Contact WHERE id = $1`, [id]);
  return result.rows[0];
}
