import type { Connection } from 'mysql2/promise';
import mysql from 'mysql2/promise';

let conn: Promise<Connection> | null = null;

export function databaseConnection() {
	if (!conn) {
		conn = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'password',
			database: 'test'
		});
	}

	return conn;
}
