import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  organization: String,
  course: String,
  startingMonth: String,
  endingMonth: String,
});

const Education = mongoose.model("Education", EducationSchema);
export default Education;
