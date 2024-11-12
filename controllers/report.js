import ReportProfile from "../models/ReportProfile.js";
import User from "../models/User.js";

export const reportProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id; // "6658656cf1ae102dfce3d1ba"
    const { reason } = req.body;
    if (userId == id) {
      return res
        .status(400)
        .json({ success: false, error: "User cannot report itself!" });
    }
    const existingReportProfile = await ReportProfile.findOne({ userId: id });
    if (!existingReportProfile) {
      const newReportProfile = await ReportProfile({
        userId: id,
      });
      newReportProfile.reportedBy = new Map();
      newReportProfile.reportedBy.set(userId, reason);
      await newReportProfile.save();
    } else {
      if (!existingReportProfile.reportedBy) {
        existingReportProfile.reportedBy = new Map();
        existingReportProfile.reportedBy.set(userId, reason);
        await existingReportProfile.save();
      } else {
        const isAlreadyReported = existingReportProfile.reportedBy.get(userId);
        if (!isAlreadyReported) {
          existingReportProfile.reportedBy.set(userId, reason);
          await existingReportProfile.save();
        } else {
          return res
            .status(400)
            .json({ success: false, error: "Already reported" });
        }
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Profile reported successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getReportedProfiles = async (req, res) => {
  try {
    const profiles = await ReportProfile.find().populate(
      "userId",
      "name profileURL bio"
    );

    if (profiles.length > 0) {
      res.status(200).json({ success: true, data: profiles });
    } else {
      res
        .status(400)
        .json({ success: false, error: "No reported profiles found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getSingleReportedProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const profile = await ReportProfile.findById(id);
    if (!profile) {
      res.status(400).json("Profile not found!");
    } else {
      const reports = profile.reportedBy; // Assuming this is an object with a map method
      const data = [];
      for (let [userId, reason] of Object.entries(reports)) {
      }
      return res.status(200).json({ success: true, data: data });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getSingleReportedProfileReasons = async (req, res) => {
  try {
    const id = req.params.id;

    const profile = await ReportProfile.findById(id);
    if (!profile) {
      res.status(400).json({ success: false, error: "Profile not found!" });
    } else {
      const reports = profile.reportedBy; // Assuming this is an object with a map method

      const dataMap = new Map();
      const data = [];
      reports.forEach(async (reason, user) => {
        if (!dataMap.get(reason)) {
          dataMap.set(reason, 1);
        } else {
          dataMap.set(reason, dataMap.get(reason) + 1);
        }
      });

      dataMap.forEach((values, keys) => {
        data.push({ reason: keys, count: values });
      });

      res.status(200).json({ success: true, data: data });
    }
  } catch (error) {}
};

export const deleteReport = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id; // "66593ac652fcb6e5f19afdf3"
    const reportProfile = await ReportProfile.findOne({ userId: id });
    if (!reportProfile) {
      return res
        .status(400)
        .json({ success: false, error: "Profile not found!" });
    } else {
      const isReported = reportProfile.reportedBy.get(userId);
      if (isReported) {
        reportProfile.reportedBy.delete(userId);
        await reportProfile.save();
        return res
          .status(200)
          .json({ success: true, message: "Report deleted successfully" });
      } else {
        return res.status(400).json({
          success: false,
          error: "Report does not exists!",
        });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
