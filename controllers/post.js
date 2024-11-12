import Post from "../models/Post.js";
import Comments from "../models/Comments.js";

export const createPost = async (req, res) => {
  try {
    const { audience, description, fileURL } = req.body;

    const user = req.user.id;

    const post = await Post.create({
      user,
      audience,
      description,
      fileURL,
      likes: new Map(),
      comments: [],
      archived: false,
      userArchived: false,
    });

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
      .populate("user", "name profileURL bio");

    if (!userId) {
      return res.status(400).json({ success: false, error: "Access Denied!" });
    }
    if (!posts)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get posts" });
    else {
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
    const post = await Post.findById({
      _id: req.params.id,
      archived: false,
      userArchived: false,
    }).populate("user");
    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get post" });
    else
      return res
        .status(200)
        .json({ success: true, data: post, userId: post.user.id });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Failed to get post" });
  }
};

export const deletePostByAdmin = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndUpdate(postId, { archived: true });
    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to delete post!" });
    else
      return res
        .status(200)
        .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete post!" });
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

// New Controllers

export const getAllLivePosts = async (req, res) => {
  try {
    // const userId = req.user;
    const posts = await Post.find({ archived: false })
      .sort({ createdAt: -1 })
      .populate("user", "name profileURL bio");
    // if (!userId) {
    //   return res.status(400).json({ success: false, error: "Access Denied!" });
    // }
    if (!posts)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get posts" });
    else {
      return res.status(200).json({
        success: true,
        status: 200,
        data: posts,
        // userId: userId,
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, status: 400, error: "Failed to get posts" });
  }
};

export const getAllArchivedPosts = async (req, res) => {
  try {
    const userId = req.user;
    const posts = await Post.find({ archived: true, userArchived: false })
      .sort({ createdAt: -1 })
      .populate("user", "name profileURL bio");
    if (!userId) {
      return res.status(400).json({ success: false, error: "Access Denied!" });
    }
    if (!posts)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get posts" });
    else {
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

export const getSingleUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ user: userId, archived: false })
      .sort({ createdAt: -1 })
      .populate("user");
    if (!posts)
      return res
        .status(400)
        .json({ success: false, error: "No posts available!" });
    else return res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndUpdate(postId, req.body);
    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to update post!" });
    else
      return res
        .status(200)
        .json({ success: true, message: "Post updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to update post!" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);
    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to delete post!" });
    else
      return res
        .status(200)
        .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete post!" });
  }
};

export const archivePostbyUser = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndUpdate(postId, {
      archived: true,
      userArchived: true,
    });

    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to archive post!" });
    else
      return res
        .status(200)
        .json({ success: true, message: "Post archived successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to archive post!" });
  }
};

export const restorePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndUpdate(postId, {
      archived: false,
      userArchived: false,
    });
    if (!post)
      return res
        .status(400)
        .json({ success: false, error: "Failed to restore post!" });
    else
      return res
        .status(200)
        .json({ success: true, message: "Post restored successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to restore post!" });
  }
};

export const userArchivedPost = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ user: userId, userArchived: true })
      .sort({ createdAt: -1 })
      .populate("user", "name profileURL bio");
    if (!userId) {
      return res.status(400).json({ success: false, error: "Access Denied!" });
    }
    if (!posts)
      return res
        .status(400)
        .json({ success: false, error: "Failed to get posts" });
    else {
      return res.status(200).json({
        success: true,
        status: 200,
        data: posts,
        userId: userId,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to get archived post!" });
  }
};
