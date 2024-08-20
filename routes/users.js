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
  getUserAchievement,
  getUserCertificate,
  getUserEducation,
  getUserExperience,
  sendRequest,
} from "../controllers/users.js";

const router = express.Router();

router.get("/all-user", verifyToken, getAllUser);
router.get("/single-user/:id", verifyToken, getSingleUser);
router.post("/send-request/:id", verifyToken, sendRequest);
router.post("/accept-request/:id", verifyToken, acceptRequest);
router.get("/received-requests", verifyToken, getReceivedRequests);
router.get("/sent-requests", verifyToken, getSentRequests);
router.get("/connections", verifyToken, getConnections);
router.get("/check-status/:id", verifyToken, checkFriendStatus);
router.get("/single-user/experience/:id", getUserExperience);
router.get("/single-user/education/:id", getUserEducation);
router.get("/single-user/achievement/:id", getUserAchievement);
router.get("/single-user/certificate/:id", getUserCertificate);
// router.post("/friends/all", getAllFriends);

export default router;
