import express from "express";
import { GetUsername, profile, updatePassword, updateUsername } from "../controllers/user.control.js"


const router = express.Router()

router.get("/profile", profile)
router.get("/getusername", GetUsername);
router.put("/updateusername/:id", updateUsername);
router.put("/updatepassword/:id", updatePassword);



export default router;