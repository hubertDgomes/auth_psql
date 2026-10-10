import { con } from "../config/dbConnector.js";
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import imageUpload from "../middleware/cloudinaryMiddleware.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
};

const signupController = async (req, res) => {
    const {
        name,
        email,
        password,
        phone,
        age,
        blood_group,
        location,
        is_available,
        last_donation_date,
        health_notes,
    } = req.body;

    const requiredFields = [
        name,
        email,
        password,
        blood_group,
        location,
        phone,
        age,
    ];

    if (requiredFields.some((field) => field === undefined || field === null || field === "")) {
        return res.status(400).json({
            message: "Name, email, password, blood_group, location, phone, and age are required.",
        });
    }

    if (!req.file) {
        return res.status(400).json({ message: "A photo_url file is required." });
    }

    try {
        const check = await con.query(
            "SELECT 1 FROM users WHERE email = $1",
            [email]
        );

        if (check.rows.length > 0) {
            return res.status(409).json({ message: "The user already exists!" });
        }

        const imgUrl = await imageUpload(req.file.path);

        const datas = await con.query(
            `INSERT INTO users (
                name, email, password, phone, age, blood_group, location,
                photo_url, is_available, last_donation_date, health_notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, name, email`,
            [
                name,
                email,
                password,
                phone || null,
                age === "" || age == null ? null : age,
                blood_group,
                location,
                imgUrl.secure_url,
                is_available ?? true,
                last_donation_date || null,
                health_notes || null,
            ]
        );

        const user = datas.rows[0]

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        )
        res.cookie("token", token, COOKIE_OPTIONS);

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });


    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to upload photo or create account." });
    }
};

const loginController = async (req , res) => {
    const {email , password} = req.body
    if(!email || !password){
        return res.status(400).json({message : "All fields are reqired."})
    }

    const check_user = "select * from users where email = $1"
    
    const duplicateUser = await con.query(check_user , [email])
    const user = duplicateUser.rows.length
    if(user == 0){
        return res.status(404).json({message : "The user does not exist!"})
    }

    const check_password = "select * from users where email = $1 and password = $2"
    const checkPassword = await con.query(check_password , [email , password])
    const validUser = checkPassword.rows.length
    if(validUser == 0){
        return res.status(401).json({message : "The password is incorrect!"})
    }

    const user_query = "select * from users where email = $1"
    const userData = await con.query(user_query , [email])
    const userInfo = userData.rows[0]

    const token = jwt.sign(
        { id: userInfo.id, email: userInfo.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    )
    res.cookie("token", token, COOKIE_OPTIONS);
    return res.status(200).json({
        message: "Login successful",
        token,
        user: { id: userInfo.id, name: userInfo.name, email: userInfo.email },
    });
    
}


const logoutController = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  })
  return res.status(200).json({ message: "Logout Successfully!" })
}

const getMe = async (req, res) => {
    const userId = req.user.id;
    const user_query = "select * from users where id = $1"
    const getData = await con.query(user_query, [userId])

    return res.status(200).json({
        message: "User data retrieved successfully",
        user: getData.rows[0]
    });
}



export default {signupController , loginController, logoutController , getMe}