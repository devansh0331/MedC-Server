import mongoose from "mongoose";

const ReportProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  reportedBy: {
    type: Map,
    of: String,
  },
});

const ReportProfile = mongoose.model("reportProfile", ReportProfileSchema);
export default ReportProfile;
