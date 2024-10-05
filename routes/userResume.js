import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";
import {
  addResume,
  getResume,
  removeResume,
} from "../controllers/userResume.js";

const router = express.Router();

router.post("/add-resume", verifyToken, upload.single("filepath"), addResume);
router.post("/get-resume", verifyToken, getResume);
router.post("/remove-resume/:id", verifyToken, removeResume);

export default router;
