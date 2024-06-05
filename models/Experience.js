import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: String,
  organization: String,
  startingMonth: String,
  endingMonth: String,
  description: String,
});

const Experience = mongoose.model("Experience", ExperienceSchema);
export default Experience;
