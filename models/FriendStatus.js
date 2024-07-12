import mongoose from "mongoose";

const friendListStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  friendStatus: {
    type: Map,
    Of: Number,
    enums: [
      0, // neutral / want to request
      1, // requested
      2, // pending
      3, // friends
    ],
  },
});

const FriendListStatus = new mongoose.model(
  "FriendListStatus",
  friendListStatusSchema
);

export default FriendListStatus;
