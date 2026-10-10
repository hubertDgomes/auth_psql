import { Pool } from "pg";
import 'dotenv/config'

const con = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

const dbConnector = () => {

    con.connect()
        .then(() => console.log("The server is connected"))
        .catch((e) => console.error(e))
}

export { con }
export default dbConnector