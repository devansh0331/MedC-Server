import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  acceptFriendRequest,
  addFriend,
  deleteFriendRequest,
  friendAction,
  friendRequests,
  getAllFriends,
  getUser,
} from "../controllers/users.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.post("/friend-action/:id", friendAction);
router.post("/friends/all", getAllFriends);
router.post("/friend/add-friend/:id", addFriend);
router.get("/friend/all", friendRequests);
router.post("/friend/accept-friend/:id", acceptFriendRequest);
router.post("/friend/delete-friend/:id", deleteFriendRequest);

export default router;
