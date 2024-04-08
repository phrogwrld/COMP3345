import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';

export const db = new Database('./data/waterloo.db', { verbose: console.log });

addUsersTable();

function addUsersTable() {
	const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT,
      text_color TEXT,
      login_attempts INTEGER DEFAULT 0,
      is_locked BOOLEAN DEFAULT FALSE
    );
  `;
	db.exec(sql);
}

export async function checkUserCreds(email: string, password: string): Promise<boolean> {
	const sql = `
    SELECT password FROM users WHERE email = ?;
  `;
	const stmt = db.prepare(sql);
	const row = stmt.get({ email });

	if (row) {
		return bcrypt.compare(password, row.password);
	} else {
		await bcrypt.hash(password, 12);
		return false;
	}
}
