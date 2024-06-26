import Post from "../models/Post.js";
import Comments from "../models/Comments.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { audience, description } = JSON.parse(req.body.data);
    const user = req.user.id;
    console.log(audience, description, user);
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
      comments: [],
    });
    console.log(post);
    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to create post" });
    else return res.status(200).json({ success: true, data: post });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Failed to create post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name profileURL");

    if (!userId) {
      return res.status(400).json({ success: false, error: "Access Denied!" });
    }
    if (!posts)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get posts" });
    else {
      console.log(posts.length);
      return res.status(200).json({
        success: true,
        status: 200,
        data: posts,
        userId: userId,
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, status: 400, error: "Failed to get posts" });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");
    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get post" });
    else return res.status(200).json({ success: true, data: post, userId: req.user.id });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Failed to get post" });
  }
};

export const likePost = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

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

    res.status(200).json({ success: true, data: updatedPost });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;

    const newComment = new Comments({
      userId,
      postId,
      comment,
    });
    await newComment.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Commented",
    });
  } catch (err) {
    res.status(400).json({ success: false, status: 400, error: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comments.find({ postId }).populate("userId");

    if (comments == "") {
      res.status(400).json({ success: false, error: "No comments Available!" });
    } else res.status(200).json({ success: true, data: comments });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    await Comments.findByIdAndDelete(commentId);
    res.status(200).json({ success: true, message: "Deleted Successfully!" });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};
