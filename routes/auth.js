import express from "express";

import { register, login } from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
// router.post("/login", verifyToken, login);
router.post("/login", login);

export default router;
