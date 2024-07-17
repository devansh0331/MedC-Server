import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  acceptRequest,
  checkFriendStatus,
  getAllUser,
  getConnections,
  getReceivedRequests,
  getSentRequests,
  getSingleUser,
  sendRequest,
} from "../controllers/users.js";

const router = express.Router();

router.get("/all-user", verifyToken, getAllUser);
router.get("/single-user/:id", verifyToken, getSingleUser);
router.post("/send-request", sendRequest);
router.post("/accept-request", acceptRequest);
router.get("/received-requests", verifyToken, getReceivedRequests);
router.get("/sent-requests", verifyToken, getSentRequests);
router.get("/connections", verifyToken, getConnections);
router.get("/check-status/:id", verifyToken, checkFriendStatus);
// router.post("/friends/all", getAllFriends);

export default router;
