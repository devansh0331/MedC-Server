import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  noOfHirings: {
    type: Number,
    default: 0,
  },
  noOfShortlisted: {
    type: Number,
    default: 0,
  },
});

const Admin = mongoose.model("admin", AdminSchema);
export default Admin;
