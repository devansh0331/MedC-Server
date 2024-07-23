import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Admin = mongoose.model("admin", AdminSchema);
export default Admin;
