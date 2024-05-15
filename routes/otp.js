import express from "express";
import { resendOTP, sendOTP, verifyOTP } from "../controllers/otp.js";

const router = express.Router();

router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTP", resendOTP);

export default router;
