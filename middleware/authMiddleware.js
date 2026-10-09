import jwt from 'jsonwebtoken'
import 'dotenv/config'

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = req.cookies?.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null)

    if (!token) {
        return res.status(401).json({
            message: "User not logged in."
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
}

export default authUser