import Admin from "../models/Admin.js";
import Post from "../models/Post.js";

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
