import express from "express";

import { register, login } from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
// router.post("/login", verifyToken, login);
router.post("/login", login);
router.get("/is-user", verifyToken, async (req, res) => {
  try {
    res.status(200).json(true);
  } catch (error) {
    res.status(400).json(false);
  }
});

export default router;
