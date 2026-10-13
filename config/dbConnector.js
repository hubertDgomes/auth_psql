import { Pool } from "pg";
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const isRemoteDatabase = connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');
const hasExplicitSSLMode = connectionString ? /(?:^|[?&])sslmode=/.test(connectionString) : false;

const con = new Pool({
    connectionString,
    ssl: isRemoteDatabase && !hasExplicitSSLMode ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

con.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err.message || err);
});

const dbConnector = async () => {
    if (!connectionString) {
        console.warn('DATABASE_URL is not set. Skipping database connection.');
        return;
    }

    try {
        const client = await con.connect();
        console.log('The server is connected');
        client.release();
    } catch (err) {
        console.error('Database connection failed:', err?.message || err);
    }
};

export { con };
export default dbConnector;