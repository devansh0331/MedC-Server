import UserJob from "../models/UserJob.js";

// SAVE JOB
export const saveJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

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
    }
    if (!newSave) {
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

// GET ALL SAVED JOBS BY USER
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.params.id;
    const savedJobs = await UserJob.find({ userId, activity: "save" });
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
    const postedJobs = await UserJob.find({ userId, activity: "post" });
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
      res.status(200).json({
        success: true,
        message: "Applied successfully",
      });
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
    const userId = req.body.id;
    const appliedJobs = await UserJob.find({ userId, activity: "apply" });
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
    const jobId = req.body.id;
    const appliedUsers = await UserJob.find({ jobId, activity: "apply" });
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
