import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otp.js";

const router = express.Router();

router.post("/sendOTP", sendOTP);
router.get("/verifyOTP", verifyOTP);

export default router;
