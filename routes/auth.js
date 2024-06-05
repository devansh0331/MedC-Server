import express from "express";

import {
  register,
  login,
  resetPassword,
  logout,
  updateAbout,
  updateSocialInfo,
  getUser,
  addEducation,
  addCertificate,
  addExperience,
  addAchievement,
  updateAchievement,
  updateExperience,
  updateCertificate,
  updateEducation,
  deleteAchievement,
  deleteExperience,
  deleteCertificate,
  deleteEducation,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/signup", register);
// router.post("/login", verifyToken, login);
router.post("/signin", login);
router.get("/is-user", verifyToken, async (req, res) => {
  try {
    res.status(200).json(true);
  } catch (error) {
    res.status(400).json(false);
  }
});
router.get("/logout", logout);

router.post("/reset-password", resetPassword);
router.post("/update-profile/about", verifyToken, updateAbout);
router.post(
  "/update-profile/social-info-no-profile",
  verifyToken,
  upload.none(),
  updateSocialInfo
);
router.post(
  "/update-profile/social-info",
  verifyToken,
  upload.single("filepath"),
  updateSocialInfo
);
router.get("/profile", verifyToken, getUser);

router.post("/update-profile/add/achievement", verifyToken, addAchievement);
router.post("/update-profile/add/experience", verifyToken, addExperience);
router.post("/update-profile/add/certificate", verifyToken, addCertificate);
router.post("/update-profile/add/education", verifyToken, addEducation);

router.post("/update-profile/edit/achievement/:id", updateAchievement);
router.post("/update-profile/edit/experience/:id", updateExperience);
router.post("/update-profile/edit/certificate/:id", updateCertificate);
router.post("/update-profile/edit/education/:id", updateEducation);

router.post("/update-profile/delete/achievement/:id", deleteAchievement);
router.post("/update-profile/delete/experience/:id", deleteExperience);
router.post("/update-profile/delete/certificate/:id", deleteCertificate);
router.post("/update-profile/delete/education/:id", deleteEducation);

export default router;
