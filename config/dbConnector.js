import { Client } from "pg";

const con = new Client({
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "hubert",
        database: "authtest"
    })

const dbConnector = () => {

    con.connect()
        .then(() => console.log("The server is connected"))
        .catch((e) => console.error(e))
}

export { con }
export default dbConnector