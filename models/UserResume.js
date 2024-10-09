import mongoose from "mongoose";

const UserResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  resumeURL: {
    type: String,
    default: null,
  },
  resumeName: {
    type: String,
    default: null,
  },
});

const UserResume = mongoose.model("UserResume", UserResumeSchema);
export default UserResume;
