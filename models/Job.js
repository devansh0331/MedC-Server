// models/Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  jobTitle: String,
  organziationName: String,
  location: String,
  salaryRange: String,
  requiredQualification: String,
  benefits: String,
  skills: String,
  experience: String,
  workTiming: String,
  jobType: String,
  jobDescription: String,
});

const Job = mongoose.model("Job", JobSchema);
export default Job;
