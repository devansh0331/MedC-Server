import Otp from "../models/Otp.js";
import randomstring from "randomstring";
import sendEmail from "../middleware/sendEmail.js";

// Generate OTP
function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}

export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = generateOTP(); // Generate a 6-digit OTP
    const newOTP = new Otp({ email, otp });
    await newOTP.save();

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Your OTP",
      message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Verify OTP provided by the user
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const existingOTP = await Otp.findOneAndDelete({ email, otp });

    if (existingOTP) {
      // OTP is valid
      res
        .status(200)
        .json({ success: true, message: "OTP verification successful" });
    } else {
      // OTP is invalid
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
