import ReportProfile from "../models/ReportProfile.js";

export const reportProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = "6658656cf1ae102dfce3d1ba"; // req.user.id
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
        console.log(isAlreadyReported);
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
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getReportedProfiles = async (req, res) => {
  try {
    const profiles = await ReportProfile.find();
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
