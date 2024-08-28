import Admin from "../models/Admin.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const addAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
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
      console.log(posts.length);
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
    if (!deactivatedUsers || deactivatedUsers.length < 1) {
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
