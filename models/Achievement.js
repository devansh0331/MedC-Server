import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  achievement: String,
  description: String,
  url: String,
});

const Achievement = mongoose.model("Achievement", AchievementSchema);
export default Achievement;
