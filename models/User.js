import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Define your Schema here
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileURL: String,
  bio: String,
  about: String,
  contact: String,
  linkedin: String,
  twitter: String,
  website: String,
  location: String,

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", UserSchema);
export default User;
