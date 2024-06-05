import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  achivement: String,
  description: String,
  url: String,
});

const Achievement = mongoose.model("Achievement", AchievementSchema);
export default Achievement;
