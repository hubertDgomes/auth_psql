import express from "express"
import auth from "../controllers/auth.controller.js"
import authUser from "../middleware/authMiddleware.js"
import multer from "multer";


const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });


router.post("/signup" , upload.single("photo_url") , auth.signupController)
router.post("/login" , auth.loginController)
router.post("/logout" , auth.logoutController)
router.get("/getme" ,authUser, auth.getMe)

export default router