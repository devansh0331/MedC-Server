import Post from "../models/Post.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { user, audience, description } = req.body;
    let fileURL = "";
    console.log("Hello " + fileURL);
    if (req.file && req.file.path) {
      console.log(req.file.path);
      const file = req.file.path;
      const result = await cloudinary.uploader.upload(file);
      fileURL = result.secure_url;
    }
    const post = await Post.create({
      user,
      audience,
      description,
      fileURL,
      likes: new Map(),
    });

    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to create post" });
    else return res.status(200).json({ success: true, post });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Failed to create post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get posts" });
    else return res.status(200).json({ success: true, posts });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Failed to get posts" });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get post" });
    else return res.status(200).json({ success: true, post });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Failed to get post" });
  }
};

export const likePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(id);

    const isLiked = post.likes.get(userId);

    if (!post.likes) {
      post.likes = new Map();
    }

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
