import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  acceptRequest,
  getAllUser,
  getUser,
  sendRequest,
} from "../controllers/users.js";

const router = express.Router();

router.get("/all-user", verifyToken, getAllUser);
router.get("/single-user/:id", verifyToken, getUser);
router.post("/send-request", sendRequest);
router.post("/accept-request", acceptRequest);
// router.post("/friends/all", getAllFriends);

export default router;
