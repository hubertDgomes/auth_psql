import express from "express"
import auth from "../controllers/auth.controller.js"
import authUser from "../middleware/authMiddleware.js"

const router = express.Router()


router.post("/signup" , auth.signupController)
router.post("/login" , auth.loginController)
router.post("/logout" , auth.logoutController)
router.get("/getme" ,authUser, auth.getMe)

export default router