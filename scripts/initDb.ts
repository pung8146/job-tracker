import { DEFAULT_DATABASE_PATH, initializeDatabase } from "../src/lib/db";

initializeDatabase();
console.log(`SQLite database ready: ${DEFAULT_DATABASE_PATH}`);
