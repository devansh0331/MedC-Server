import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { friendAction, getAllFriends, getUser } from "../controllers/users.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.post("/friend-action/:id", friendAction);
router.post("/friends/all", getAllFriends);

export default router;
