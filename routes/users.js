import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getUser } from "../controllers/users.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);

export default router;
