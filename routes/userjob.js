import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  applyJob,
  checkIfApplied,
  checkIfSaved,
  contactUsMail,
  deleteJobApplication,
  getAppliedJobs,
  getAppliedUsers,
  getPostedJobs,
  getSavedJobs,
  getShortlistedCandidates,
  saveJob,
  shortListCandidate,
  shortListCandidateWithoutJob,
  unsaveJob,
} from "../controllers/userjob.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/save-job", verifyToken, saveJob);
router.post("/unsave-job", verifyToken, unsaveJob);
router.post("/check-saved-job", verifyToken, checkIfSaved);
router.get("/get-saved-jobs/:id", verifyToken, getSavedJobs);
router.get("/get-posted-job/:id", verifyToken, getPostedJobs);
router.post("/apply-job", verifyToken, applyJob);
router.post(
  "/apply-job-with-resume",
  verifyToken,
  upload.single("filepath"),
  applyJob
);
router.post("/delete-application", verifyToken, deleteJobApplication);
router.get("/get-applied-jobs/:id", verifyToken, getAppliedJobs);
router.get("/get-users-job/:id", verifyToken, getAppliedUsers);
router.post("/check-application", verifyToken, checkIfApplied);
router.post("/shortlist-candidate/:id", verifyToken, shortListCandidate);
router.post("/shortlist-candidate-directly", verifyToken, shortListCandidateWithoutJob);
router.post("/contactus-mail", contactUsMail);
router.post("/get-shortlisted-candidates/:id", verifyToken, getShortlistedCandidates);

export default router;
