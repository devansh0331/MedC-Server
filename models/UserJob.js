import mongoose from "mongoose";

const UserJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.ObjectId,
      ref: "Job",
      required: true,
    },
    activity: {
      type: String,
      enum: ["save", "apply", "post", "shortlist"],
      default: "save",
      required: true,
    },
    resume: {
      type: mongoose.Schema.ObjectId,
      ref: "UserResume",
    },
  },
  {
    unique: ["userId", "jobId"],
  }
);

const UserJob = mongoose.model("UserJob", UserJobSchema);
export default UserJob;
