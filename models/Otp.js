// models/otpModel.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
});

const Otp = mongoose.model("otps", otpSchema);

export default Otp;
