import mongoose from "mongoose";

const UserJobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    jobId: {
        type: mongoose.Schema.ObjectId,
        ref: "Job",
    },
    activity: String,
    resume: {
        type: String,
        default: null
    }
});

const UserJob = mongoose.model("UserJob", UserJobSchema);
export default UserJob