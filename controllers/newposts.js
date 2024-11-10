import Post from "../models/Post.js";
export const newPost = async (req, res) => {
  console.log("offset");
  const limit = 10; // Number of posts per page
  const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
  try {
    const paginatedPosts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("user", "name profileURL bio");

    res.json(paginatedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json("Internal server error");
  }
};
