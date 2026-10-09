import { con } from "../config/dbConnector.js";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
};

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

        const datas = await con.query(
            "INSERT INTO userdata (name, email, password) VALUES ($1, $2, $3) RETURNING sl_no, name, email",
            [name, email, password]
        );

        const user = datas.rows[0]

        const token = jwt.sign(
            { id: user.sl_no, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        )
        res.cookie("token", token, COOKIE_OPTIONS);

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: { id: user.sl_no, name: user.name, email: user.email },
        });


    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
};

const loginController = async (req , res) => {
    const {email , password} = req.body
    if(!email || !password){
        return res.status(400).json({message : "All fields are reqired."})
    }

    const check_user = "select * from userdata where email = $1"
    
    const duplicateUser = await con.query(check_user , [email])
    const user = duplicateUser.rows.length
    if(user == 0){
        return res.status(404).json({message : "The user does not exist!"})
    }

    const check_password = "select * from userdata where email = $1 and password = $2"
    const checkPassword = await con.query(check_password , [email , password])
    const validUser = checkPassword.rows.length
    if(validUser == 0){
        return res.status(401).json({message : "The password is incorrect!"})
    }

    const user_query = "select * from userdata where email = $1"
    const userData = await con.query(user_query , [email])
    const userInfo = userData.rows[0]

    const token = jwt.sign(
        { id: userInfo.sl_no, email: userInfo.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    )
    res.cookie("token", token, COOKIE_OPTIONS);
    return res.status(200).json({
        message: "Login successful",
        token,
        user: { id: userInfo.sl_no, name: userInfo.name, email: userInfo.email },
    });
    
}



export default {signupController , loginController}