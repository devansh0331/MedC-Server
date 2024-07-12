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
  isGoogleSignIn: {
    type: Boolean,
    default: false,
  },
  profileURL: String,
  bio: String,
  about: String,
  contact: String,
  linkedin: String,
  twitter: String,
  website: String,
  location: String,

  friendList: {
    type: mongoose.Schema.ObjectId,
    ref: "FriendListStatus",
  },

  achievement: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
    },
  ],
  certificate: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
    },
  ],
  education: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Education",
    },
  ],
  experience: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
    },
  ],
});

const User = mongoose.model("User", UserSchema);
export default User;
