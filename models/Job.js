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
  minimumSalary: Number,
  maximumSalary: Number,
  salaryType: String,
  requiredQualification: String,
  employementType: String,
  minExperience: Number,
  lastDateToApply: Date,
  description: String, 
  archived: Boolean,
  userArchived: Boolean,
  noOfApplications: Number,
  noOfHirings: Number,
});

const Job = mongoose.model("Job", JobSchema);
export default Job;
