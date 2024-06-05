import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  post: String,
  organization: String,
  startingMonth: String,
  endingMonth: String,
  description: String,
});

const Experience = mongoose.model("Experience", ExperienceSchema);
export default Experience;
