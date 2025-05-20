import { pool } from '../db';

// Define the Contact type
export type Contact = {
  id: number;
  email: string | null;
  phonenumber: string | null;
  linkprecedence: 'primary' | 'secondary';
  linkedid?: number | null;
  createdat?: Date;
};

// Fetch contacts by email or phone
export async function findContactsByEmailOrPhone(email: string, phone: string): Promise<Contact[]> {
  const result = await pool.query(
    `SELECT * FROM Contact WHERE email = $1 OR phoneNumber = $2`,
    [email, phone]
  );
  return result.rows;
}

// Create a new contact
export async function createContact(
  email: string,
  phone: string,
  linkedId: number | null,
  precedence: 'primary' | 'secondary'
): Promise<Contact> {
  const result = await pool.query(
    `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES ($1, $2, $3, $4) RETURNING *`,
    [email, phone, linkedId, precedence]
  );
  return result.rows[0];
}

// Find contact by ID (optional utility)
export async function findContactById(id: number): Promise<Contact | null> {
  const result = await pool.query(`SELECT * FROM Contact WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

