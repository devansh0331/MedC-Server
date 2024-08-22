import Blog from "../models/Blog.js";

export const addBlog = async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const userId = req.user.id;
    const newBlog = await Blog.create({ title, userId, summary, content });
    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to add blog" });
  }
};
export const editBlog = async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const blogId = req.params.id;
    const newBlog = await Blog.findByIdAndUpdate(
      { blogId },
      { title, summary, content },
      { new: true }
    );
    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to add blog" });
  }
};
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const newBlog = await Blog.findByIdAndDelete(blogId);
    res
      .status(201)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to add blog" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("userId");
    if (blogs.length > 0) res.status(200).json({ success: true, data: blogs });
    else res.status(404).json({ success: false, message: "No blogs found" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to get blogs" });
  }
};
export const getUserBlogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogs = await Blog.find({ userId }).populate("userId");
    if (blogs.length > 0) res.status(200).json({ success: true, data: blogs });
    else res.status(404).json({ success: false, message: "No blogs found" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to get blogs" });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blogs = await Blog.findById(blogId).populate("userId");
    if (blogs.length > 0) res.status(200).json({ success: true, data: blogs });
    else res.status(404).json({ success: false, message: "No blogs found" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to get blogs" });
  }
};
