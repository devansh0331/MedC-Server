import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import Experience from "../models/Experience.js";
import Achievement from "../models/Achievement.js";
import Education from "../models/Education.js";
import Certificate from "../models/Certificate.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      // Data from Client
      name,
      email,
      password,
    } = req.body;

    try {
      const isUser = await User.findOne({ email });
      if (isUser) {
        return res
          .status(400)
          .json({ success: false, error: "User already exists" });
      }
    } catch (error) {}

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

/* SIGNIN WITH GOOGLE */
export const signInWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("Token", token);
    const { email, name, picture, email_verified } = jwt.decode(token);
    const user = await User.findOne({ email });

    if (email_verified == false)
      res.status(400).json({ success: false, error: "Email not verified" });

    if (user) {
      const jwttoken = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({
        success: true,
        user,
        token: jwttoken,
        message: "Logged In Successfully",
      });
    } else {
      const salt = await bcrypt.genSalt();

      // Password converted as per Hash Function
      const passwordHash = await bcrypt.hash(
        process.env.GOOGLE_SIGNUP_PASSWORD,
        salt
      );
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        profileURL: picture,
        isGoogleSignIn: true,
      });
      const savedUser = await newUser.save();
      const jwttoken = jwt.sign(
        {
          id: savedUser._id,
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({
        success: true,
        user: savedUser,
        token: jwttoken,
        message: "Account Created Successfully",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, error: "User does not exist. " });
    if (user.isGoogleSignIn == true)
      return res
        .status(400)
        .json({ success: false, error: "Please verify your email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res // res.status(200).json({ token, user: user.email});
      .status(200)
      .json({ success: true, token: token, user: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
    console.log(err);
  }
};

// RESET PASSWORD
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

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const id = req.user.id;
    const { about } = req.body;
    const user = await User.findByIdAndUpdate(id, { about }, { new: true });
    res.status(200).json({ success: true, message: user.about });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateSocialInfo = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, bio, email, location, contact, linkedin, twitter, website } =
      JSON.parse(req.body.data);

    let profileURL = "";
    let user;
    if (req.file && req.file.path) {
      console.log(req.file.path);
      const profile = req.file.path;
      const result = await cloudinary.uploader.upload(profile);
      profileURL = result.secure_url;
      user = await User.findByIdAndUpdate(
        id,
        {
          name,
          bio,
          email,
          location,
          contact,
          linkedin,
          twitter,
          website,
          profileURL,
        },
        { new: true }
      );
    } else {
      user = await User.findByIdAndUpdate(
        id,
        {
          name,
          bio,
          email,
          location,
          contact,
          linkedin,
          twitter,
          website,
        },
        { new: true }
      );
    }

    res.status(200).json({ success: true, message: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/* READ */
export const getUser = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    const user = await User.findById(id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const getUserExperience = async (req, res) => {
  try {
    const id = req.user.id;
    const experience = await Experience.find({ userId: id });
    res.status(200).json({ success: true, data: experience });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
export const getUserEducation = async (req, res) => {
  try {
    const id = req.user.id;
    const education = await Education.find({ userId: id });
    res.status(200).json({ success: true, data: education });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
export const getUserAchievement = async (req, res) => {
  try {
    const id = req.user.id;
    const achievement = await Achievement.find({ userId: id });
    res.status(200).json({ success: true, data: achievement });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
export const getUserCertificate = async (req, res) => {
  try {
    const id = req.user.id;
    const certificate = await Certificate.find({ userId: id });
    res.status(200).json({ success: true, data: certificate });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const addExperience = async (req, res) => {
  try {
    const userId = req.user.id;

    const { organization, post, description, startingMonth, endingMonth } =
      req.body;

    const experience = await Experience.create({
      userId,
      organization,
      post,
      description,
      startingMonth,
      endingMonth,
    });

    if (!experience)
      res
        .status(400)
        .json({ success: false, error: "Failed to add experience" });
    else
      res
        .status(200)
        .json({ success: true, message: "Experience Added Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to add experience" });
  }
};
export const updateExperience = async (req, res) => {
  try {
    const id = req.params.id;

    const { organization, post, description, startingMonth, endingMonth } =
      req.body;

    const experience = await Experience.findByIdAndUpdate(id, {
      organization,
      post,
      description,
      startingMonth,
      endingMonth,
    });

    if (!experience)
      res
        .status(400)
        .json({ success: false, error: "Failed to update experience" });
    else
      res
        .status(200)
        .json({ success: true, message: "Experience Updated Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to update experience" });
  }
};
export const deleteExperience = async (req, res) => {
  try {
    const id = req.params.id;

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience)
      res
        .status(400)
        .json({ success: false, error: "Failed to delete experience" });
    else
      res
        .status(200)
        .json({ success: true, message: "Experience Deleted Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to delete experience" });
  }
};
export const addAchievement = async (req, res) => {
  try {
    const userId = req.user.id;
    const { achievement, description } = req.body;

    const newAchievement = await Achievement.create({
      userId,
      achievement,
      description,
    });

    if (!newAchievement)
      res
        .status(400)
        .json({ success: false, error: "Failed to add achievement" });
    else
      res
        .status(200)
        .json({ success: true, message: "Achievement Added Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to add achievement" });
  }
};
export const updateAchievement = async (req, res) => {
  try {
    const id = req.params.id;
    const { achievement, description } = req.body;

    const newAchievement = await Achievement.findByIdAndUpdate(id, {
      achievement,
      description,
    });

    if (!newAchievement)
      res
        .status(400)
        .json({ success: false, error: "Failed to update achievement" });
    else
      res
        .status(200)
        .json({ success: true, message: "Achievement Updated Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to update achievement" });
  }
};
export const deleteAchievement = async (req, res) => {
  try {
    const id = req.params.id;

    const achievement = await Achievement.findByIdAndDelete(id);

    if (!achievement)
      res
        .status(400)
        .json({ success: false, error: "Failed to delete achievement" });
    else
      res
        .status(200)
        .json({ success: true, message: "Achievement Deleted Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to delete achievement" });
  }
};
export const addCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { certificate, issuer, description } = req.body;

    const newCertificate = await Certificate.create({
      userId,
      certificate,
      issuer,
      description,
    });

    if (!newCertificate)
      res
        .status(400)
        .json({ success: false, error: "Failed to add certificate" });
    else
      res
        .status(200)
        .json({ success: true, message: "Certificate Added Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to add certificate" });
  }
};
export const updateCertificate = async (req, res) => {
  try {
    const id = req.params.id;
    const { certificate, issuer, description } = req.body;

    const newCertificate = await Certificate.findByIdAndUpdate(id, {
      certificate,
      issuer,
      description,
    });

    if (!newCertificate)
      res
        .status(400)
        .json({ success: false, error: "Failed to update certificate" });
    else
      res
        .status(200)
        .json({ success: true, message: "Certificate Updated Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to update certificate" });
  }
};
export const deleteCertificate = async (req, res) => {
  try {
    const id = req.params.id;

    const certificate = await Certificate.findByIdAndDelete(id);

    if (!certificate)
      res
        .status(400)
        .json({ success: false, error: "Failed to delete certificate" });
    else
      res
        .status(200)
        .json({ success: true, message: "Certificate Deleted Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to delete certificate" });
  }
};
export const addEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { organization, course, startingMonth, endingMonth } = req.body;

    const newEducation = await Education.create({
      userId,
      organization,
      course,
      startingMonth,
      endingMonth,
    });

    if (!newEducation)
      res
        .status(400)
        .json({ success: false, error: "Failed to add education" });
    else
      res
        .status(200)
        .json({ success: true, message: "Education Added Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to add education" });
  }
};
export const updateEducation = async (req, res) => {
  try {
    const id = req.params.id;
    const { organization, course, startingMonth, endingMonth } = req.body;

    const newEducation = await Education.findByIdAndUpdate(id, {
      organization,
      course,
      startingMonth,
      endingMonth,
    });

    if (!newEducation)
      res
        .status(400)
        .json({ success: false, error: "Failed to update education" });
    else
      res
        .status(200)
        .json({ success: true, message: "Education Updated Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to update education" });
  }
};
export const deleteEducation = async (req, res) => {
  try {
    const id = req.params.id;

    const education = await Education.findByIdAndDelete(id);

    if (!education)
      res
        .status(400)
        .json({ success: false, error: "Failed to delete education" });
    else
      res
        .status(200)
        .json({ success: true, message: "Education Deleted Successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Failed to delete education" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const id = req.user.id;

    if (req.file && req.file.path) {
      console.log(req.file.path);
      const resumeFile = req.file.path;
      const result = await cloudinary.uploader.upload(profile);
      let resumeURL = result.secure_url;
      await User.findByIdAndUpdate(id, { resume: resumeURL }, { new: true });
      return res.status(200).json({
        success: true,
        data: resume,
        message: "Resume Uploaded Successfully",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Resume Uploaded Successfully" });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: `Failed to upload resume: ${err.message}`,
    });
  }
};

export const deactivateAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User does not exists!" });
    } else {
      if (!user.isUserDeactivated || user.isUserDeactivated == false) {
        await User.findByIdAndUpdate(
          id,
          { isUserDeactivated: true },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          message: "Account Deactivated Successfully!",
        });
      } else {
        await User.findByIdAndUpdate(id, { isUserDeactivated: false });
        return res
          .status(400)
          .json({ success: false, error: "Account Activated Successfully!" });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
