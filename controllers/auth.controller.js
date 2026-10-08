import { con } from "../config/dbConnector.js";

const signupController = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const check = await con.query(
            "SELECT 1 FROM userdata WHERE email = $1",
            [email]
        );

        if (check.rows.length > 0) {
            return res.status(409).json({ message: "The user already exists!" });
        }

        await con.query(
            "INSERT INTO userdata (name, email, password) VALUES ($1, $2, $3)",
            [name, email, password]
        );

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
};

export default signupController