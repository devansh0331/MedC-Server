import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  audience: String,
  description: String,
  fileURL: String,
});

const Post = mongoose.model("Post", PostSchema);
export default Post;
