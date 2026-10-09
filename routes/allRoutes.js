import express from "express"
import auth from "../controllers/auth.controller.js"

const router = express.Router()


router.post("/signup" , auth.signupController)
router.post("/login" , auth.loginController)

export default router