import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      // Data from Client
      name,
      email,
      password,
    } = req.body;

    const salt = await bcrypt.genSalt();

    // Password converted as per Hash Function
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      // Data as per Schema
      name,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res // res.status(200).json({ token, user: user.email});
      .status(200)
      .json({ token: token, user: user });
  } catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { _id, password } = req.body;

    const user = await User.findById(_id);

    if (!user)
      res.status(400).json({ success: false, error: "User does not exists!" });
    else {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      console.log("Hello");
      console.log("Hello2");
      await User.updateOne({ _id }, { password: passwordHash });
      res
        .status(200)
        .json({ success: true, message: "Password updated successfully!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
