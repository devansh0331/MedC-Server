import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const {
      user,
      jobTitle,
      organziationName,
      location,
      salaryRange,
      requiredQualification,
      benefits,
      skills,
      experience,
      workTiming,
      jobType,
      jobDescription,
    } = req.body;

    const newJob = await Job.create({
      user,
      jobTitle,
      organziationName,
      location,
      salaryRange,
      requiredQualification,
      benefits,
      skills,
      experience,
      workTiming,
      jobType,
      jobDescription,
    });

    if (!newJob) {
      return res
        .status(400)
        .json({ success: false, error: "Job creation failed" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Job created successfully" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Job creation failed" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("user");

    if (!jobs)
      return res
        .status(400)
        .json({ success: false, error: "No jobs available!" });
    else return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "No jobs available!" });
  }
};

export const getSingleJob = async (req, res) => {
  try {
    const _id = req.params.id;
    const job = await Job.findById(_id).populate("user");
    if (!job)
      return res.status(400).json({ success: false, error: "No job found!" });
    else return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(400).json({ success: false, error: "No job found!" });
  }
};
