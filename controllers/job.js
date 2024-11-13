import Job from "../models/Job.js";
import UserJob from "../models/UserJob.js";
import User from "../models/User.js";

export const createJob = async (req, res) => {
  try {
    const {
      user,
      jobTitle,
      organziationName,
      location,
      minimumSalary,
      maximumSalary,
      salaryType,
      requiredQualification,
      employementType,
      minExperience,
      lastDateToApply,
      description,
      archived,
      userArchived,
    } = req.body;

    const newJob = await Job.create({
      user,
      jobTitle,
      organziationName,
      location,
      minimumSalary,
      maximumSalary,
      salaryType,
      requiredQualification,
      employementType,
      minExperience,
      lastDateToApply,
      description,
      archived,
      userArchived,
      noOfApplications: 0,
      noOfHirings: 0,
    });

    if (!newJob) {
      return res
        .status(400)
        .json({ success: false, error: "Job creation failed" });
    } else {
      const userJob = await UserJob.create({
        userId: user,
        jobId: newJob._id,
        activity: "post",
      });

      if (!userJob) {
        return res
          .status(400)
          .json({ success: false, error: "Job creation failed" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Job created successfully" });
      }
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Job creation failed" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("user").sort({ createdAt: -1 });

    if (!jobs)
      return res
        .status(400)
        .json({ success: false, error: "No jobs available!" });
    else return res.status(200).json({ success: true, jobs: jobs });
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
    else return res.status(200).json({ success: true, job: job });
  } catch (error) {
    return res.status(400).json({ success: false, error: "No job found!" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const _id = jobId;
    const job = await Job.findByIdAndDelete(_id);
    if (!job) {
      return res.status(400).json({ success: false, error: "No job found!" });
    } else {
      const userJob = await UserJob.findOneAndDelete({
        userId,
        jobId,
        activity: "post",
      });
      if (!userJob) {
        return res.status(400).json({ success: false, error: "No job found!" });
      } else {
        return res.status(200).json({ success: true, job });
      }
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: "No job found!" });
  }
};

export const editJob = async (req, res) => {
  try {
    const {
      jobTitle,
      organziationName,
      location,
      minimumSalary,
      maximumSalary,
      salaryType,
      requiredQualification,
      employementType,
      minExperience,
      lastDateToApply,
      description,
      archived,
      userArchived,
    } = req.body;
    const _id = req.params.id;
    const job = await Job.findByIdAndUpdate(
      _id,
      {
        jobTitle,
        organziationName,
        location,
        minimumSalary,
        maximumSalary,
        salaryType,
        requiredQualification,
        employementType,
        minExperience,
        lastDateToApply,
        description,
        archived,
        userArchived,
      },
      { new: true }
    );
    if (!job) {
      return res.status(400).json({ success: false, error: "No job found!" });
    } else {
      return res.status(200).json({ success: true, job });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: "No job found!" });
  }
};
