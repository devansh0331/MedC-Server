import Job from "../models/Job.js";
import UserJob from "../models/UserJob.js";
import Admin from "../models/Admin.js";
import sendEmail from "../middleware/sendEmail.js";

// SAVE JOB
export const saveJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Check if the job is already saved by the user
    const existingSave = await UserJob.findOne({
      userId,
      jobId,
      activity: "save",
    });
    if (existingSave) {
      return res.status(400).json({
        success: false,
        error: "Job is already saved",
      });
    }

    const newSave = await UserJob.create({
      userId,
      jobId,
      activity: "save",
    });

    if (newSave) {
      res.status(200).json({
        success: true,
        message: "Job saved successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Failed to save job",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to save job",
    });
  }
};

// UNSAVE JOB
export const unsaveJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const unsaveJob = await UserJob.findOneAndDelete({
      userId,
      jobId,
      activity: "save",
    });
    if (!unsaveJob) {
      res.status(400).json({
        success: false,
        error: "Failed to unsave job",
      });
    }
    if (unsaveJob) {
      res.status(200).json({
        success: true,
        message: "Job unsaved",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to unsave job",
    });
  }
};

// CHECK IF JOB IS SAVED
export const checkIfSaved = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const isSaved = await UserJob.findOne({ userId, jobId, activity: "save" });
    if (!isSaved) {
      res.status(200).json({
        success: true,
        isSaved: false,
      });
    }
    if (isSaved) {
      res.status(200).json({
        success: true,
        isSaved: true,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to check if job is saved",
    });
  }
};

// GET ALL SAVED JOBS BY USER
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.params.id;

    const savedJobs = await UserJob.find({ userId, activity: "save" })
      .populate("jobId")
      .populate("userId");

    if (!savedJobs) {
      res.status(400).json({
        success: false,
        error: "Failed to get saved jobs",
      });
    }
    if (savedJobs) {
      res.status(200).json({
        success: true,
        savedJobs: savedJobs,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to get saved jobs",
    });
  }
};

// GET ALL POSTED JOBS BY USER
export const getPostedJobs = async (req, res) => {
  try {
    const userId = req.params.id;
    const postedJobs = await UserJob.find({ userId, activity: "post" })
      .populate("jobId")
      .populate("userId");
    if (!postedJobs) {
      res.status(400).json({
        success: false,
        error: "Failed to get posted jobs",
      });
    }
    if (postedJobs) {
      res.status(200).json({
        success: true,
        postedJobs: postedJobs,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to get posted jobs",
    });
  }
};

// APPLY JOB WITHOUT RESUME
export const applyJob = async (req, res) => {
  try {
    const { userId, jobId, userResumeId } = req.body;

    const newJobApply = await UserJob.create({
      userId,
      jobId,
      activity: "apply",
      resume: userResumeId != undefined ? userResumeId : null,
    });

    if (newJobApply) {
      const job = await Job.findById(jobId);
      job.noOfApplications = job.noOfApplications + 1;
      await job.save();
      res.status(200).json({
        success: true,
        message: "Applied successfully",
      })
    }
    if (!newJobApply) {
      res.status(400).json({
        success: false,
        error: "Failed to apply for the job",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to apply for the job",
    });
  }
};

// RETRIEVE JOB APPLICATION
export const deleteJobApplication = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const jobApplication = await UserJob.findOneAndDelete({
      userId,
      jobId,
      activity: "apply",
    });
    if (!jobApplication) {
      res.status(400).json({
        success: false,
        error: "Failed to delete job application",
      });
    }
    if (jobApplication) {
      const job = await Job.findById(jobId);
      job.noOfApplications = job.noOfApplications - 1;
      await job.save();
      res.status(200).json({
        success: true,
        message: "Job application deleted successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to delete job application",
    });
  }
};

// GET ALL APPLIED JOBS BY USER
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.params.id;
    const appliedJobs = await UserJob.find({ userId, activity: "apply" })
      .populate("jobId")
      .populate("userId");
    if (!appliedJobs) {
      res.status(400).json({
        success: false,
        error: "Failed to get applied jobs",
      });
    }
    if (appliedJobs) {
      res.status(200).json({
        success: true,
        appliedJobs: appliedJobs,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to get applied jobs",
    });
  }
};

// GET ALL USERS WHO APPLIED FOR A JOB
export const getAppliedUsers = async (req, res) => {
  try {
    const jobId = req.params.id;

    const appliedUsers = await UserJob.find({ jobId, activity: "apply" })
      .populate("userId")
      .populate("resume");
    if (!appliedUsers) {
      res.status(400).json({
        success: false,
        error: "Failed to get applied users",
      });
    }
    if (appliedUsers) {
      res.status(200).json({
        success: true,
        appliedUsers: appliedUsers,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to get applied users",
    });
  }
};

// CHECK IF USER HAS APPLIED FOR A JOB
export const checkIfApplied = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const isApplied = await UserJob.findOne({
      userId,
      jobId,
      activity: "apply",
    });
    if (!isApplied) {
      res.status(200).json({
        success: true,
        isApplied: false,
      });
    }
    if (isApplied) {
      res.status(200).json({
        success: true,
        isApplied: true,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to check if user has applied for the job",
    });
  }
};

// SHORTLIST CANDIDATE
export const shortListCandidate = async (req, res) => {
  try {
    const { candidateId, candidateEmail, mailbody } = req.body;

    const jobId = req.params.id;
    const owner = req.user.id;

    const job = await Job.findById(jobId);

    if (!job)
      return res.status(400).json({ success: false, error: "No job found!" });
    else if (job.user != owner)
      return res
        .status(400)
        .json({ success: false, error: "You are not authorized" });
    else {
      await sendEmail({
        to: candidateEmail,
        subject: "Your profile has been shortlisted at MedC Job Portal",
        message: `${mailbody}`,
      });

      job.noOfShortListed = job.noOfShortListed + 1;

      await job.save();

      await Admin.findOneAndUpdate(
        { userId: "664f9e4252492b36eb5c94cf" },
        { $inc: { noOfShortlisted: 1 } }
      );

      await UserJob.findOneAndUpdate(
        { userId: candidateId, jobId, activity: "apply" },
        { activity: "shortlist" }
      );

      return res.status(200).json({ success: true, message: "Email sent" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error!" });
  }
};

// SHORTLIST CANDIDATE WITHOUT JOB ID
export const shortListCandidateWithoutJob = async (req, res) => {
  try {
    const { candidateEmail, mailbody } = req.body;
    const owner = req.user.id;

    await sendEmail({
      to: candidateEmail,
      subject: "Your profile has been shortlisted at MedC Job Portal",
      message: `${mailbody}`,
    });

    await Admin.findOneAndUpdate(
      { userId: "664f9e4252492b36eb5c94cf" },
      { $inc: { noOfHirings: 1 } }
    );

    return res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error!" });
  }
};

// GET SHORTLISTED CANDIDATES
export const getShortlistedCandidates = async (req, res) => {
  try {
    const jobId = req.params.id
  const data = await UserJob.find({jobId, activity: "shortlist"}).populate("userId");
  if(data.length <= 0){
    res.status(200).json({
      success: false,
      message: "No candidates shortlisted"
    })
  }else{
    res.status(200).json({
      success: true,
      data: data
    })
  } 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get shortlisted candidates"
    })
  }
}

// CONTACT US MAIL
export const contactUsMail = async (req, res) => {
  try {
    const { candidateEmail, mailbody } = req.body;

    await sendEmail({
      to: candidateEmail,
      subject: "You have a new query at MedC Job Portal",
      message: `${mailbody}`,
    });

    return res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error!" });
  }
};
