import { seedMockJobs } from "../src/lib/seedJobs";

const result = seedMockJobs();

console.log(`Mock jobs seeded: ${result.inserted}`);
console.log(`SQLite database: ${result.dbPath}`);
