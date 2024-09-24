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
  experience: String,
  requiredQualification: String,
  skills: String,
  workTiming: String,
  jobType: String,
  jobDescription: String, 
  lastDateToApply: Date,
  archived: Boolean,
  userArchived: Boolean,
  noOfApplications: Number,
});

const Job = mongoose.model("Job", JobSchema);
export default Job;
