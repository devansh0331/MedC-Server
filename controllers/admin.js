import sendEmail from "../middleware/sendEmail.js";
import Admin from "../models/Admin.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const isAdmin = async (req, res) => {
  try {
    const id = req.admin;

    if (id == null || id == undefined) {
      return res
        .status(400)
        .json({ success: false, error: "User is not admin!" });
    } else {
      return res.status(200).json({ success: true, message: "User is admin!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
export const addAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const admin = await Admin.findOne({ userId });

    if (!admin) {
      const newAdmin = new Admin({
        userId,
      });
      await newAdmin.save();
      return res
        .status(200)
        .json({ success: true, message: "Admin added successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "User is already an admin" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to add as "admin"! due to Server Error',
    });
  }
};
export const removeAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const isAdmin = await Admin.findOne({ userId });
    if (!isAdmin) {
      return res
        .status(400)
        .json({ success: false, error: "User is not Admin!" });
    } else {
      await Admin.findByIdAndDelete(isAdmin._id);
      return res
        .status(200)
        .json({ success: true, message: "Admin removed successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to remove as "admin"!',
    });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name profileURL")
      .limit(20);

    if (!posts)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get posts" });
    else {
      return res.status(200).json({
        success: true,
        data: posts,
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, status: 400, error: "Failed to get posts" });
  }
};
export const deactivateAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const { userEmail, mailbody } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User does not exists!" });
    } else {
      if (!user.isDeactivated || user.isDeactivated == false) {
        await User.findByIdAndUpdate(
          id,
          { isDeactivated: true },
          { new: true }
        );
        await sendEmail({
          to: userEmail,
          subject: "Your account has been deactivated at MedC Job Portal",
          message: `${mailbody}`,
        });
        return res.status(200).json({
          success: true,
          message: "Account Deactivated Successfully!",
        });
      } else {
        await User.findByIdAndUpdate(id, { isDeactivated: false });
        return res
          .status(200)
          .json({ success: true, error: "Account Activated Successfully!" });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const deactivatedAccounts = async (req, res) => {
  try {
    const deactivatedUsers = await User.find({ isDeactivated: true });
    if (!deactivatedUsers) {
      return res
        .status(400)
        .json({ success: false, error: "No Deactivated Accounts!" });
    } else {
      return res.status(200).json({
        success: true,
        data: deactivatedUsers,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,

      error: "Failed to get deactivated accounts",
    });
  }
};
export const activateAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const { userEmail, mailbody } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User does not exists!" });
    } else {
      if (!user.isDeactivated || user.isDeactivated == true) {
        await User.findByIdAndUpdate(
          id,
          { isDeactivated: false, isUserDeactivated: false },
          { new: true }
        );
        await sendEmail({
          to: userEmail,
          subject: "Your account has been activated at MedC Job Portal",
          message: `${mailbody}`,
        });
        return res.status(200).json({
          success: true,
          message: "Account Activated Successfully!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to activate account",
    });
  }
};
export const isUserAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findOne({ userId: id });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, error: "User is not admin!" });
    } else {
      return res.status(200).json({ success: true, message: "User is admin!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate("userId");
    if (!admins) {
      return res
        .status(400)
        .json({ success: false, error: "Failed to get admins" });
    } else {
      return res.status(200).json({
        success: true,
        data: admins,
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Failed to get admins" });
  }
};
