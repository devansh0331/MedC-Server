import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    title: String,
    content: String,
    coverImage: String,
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("blog", BlogSchema);
export default Blog;
