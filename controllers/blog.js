import Blog from "../models/Blog.js";
import { v2 as cloudinary } from "cloudinary";

export const addBlog = async (req, res) => {
  try {
    const { title, content } = JSON.parse(req.body.data);
    const userId = req.user.id; 

    let fileURL = "";
    if (req.file && req.file.path) {
      console.log(req.file.path);
      const file = req.file.path;
      const result = await cloudinary.uploader.upload(file);
      fileURL = result.secure_url;
    }

    const newBlog = await Blog.create({
      title,
      content,
      coverImage: fileURL,
      userId,
    });

    res.status(201).json({ success: true, data: newBlog, message: "Blog created successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Failed to add blog" });
  }
};

export const editBlog = async (req, res) => {
  try {
    // Extract data from the request body
    const { title, content } = req.body;
    const blogId = req.params.id;

    // Validate data (optional, add validation logic if needed)

    // Find the blog by ID
    const existingBlog = await Blog.findById(blogId);

    // Check if blog exists
    if (!existingBlog) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    // Update the blog document
    existingBlog.title = title;
    existingBlog.content = content;

    // Save the updated blog (uses built-in validation)
    const updatedBlog = await existingBlog.save();

    // Respond with success message and the updated blog data
    res.status(200).json({ success: true, data: updatedBlog });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ success: false, error: "Failed to edit blog" });
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
    console.log(blogId);
    
    const blogs = await Blog.findById(blogId);
    console.log(blogs);
    
    if (blogs) res.status(200).json({ success: true, data: blogs });
    else res.status(404).json({ success: false, message: "No blogs found" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to get blogs" });
  }
};

// export const addBlog = async (req, res) => {
//   try {
//     const { title, summary, content } = req.body;
//     const userId = req.user.id;
//     const newBlog = await Blog.create({ title, userId, summary, content });
//     res.status(201).json({ success: true, data: newBlog });
//   } catch (error) {
//     res.status(400).json({ success: false, error: "Failed to add blog" });
//   }
// };
// export const editBlog = async (req, res) => {
//   try {
//     const { title, summary, content } = req.body;
//     const blogId = req.params.id;
//     const newBlog = await Blog.findByIdAndUpdate(
//       { blogId },
//       { title, summary, content },
//       { new: true }
//     );
//     res.status(201).json({ success: true, data: newBlog });
//   } catch (error) {
//     res.status(400).json({ success: false, error: "Failed to add blog" });
//   }
// };