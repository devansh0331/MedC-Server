import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  applyJob,
  deleteJobApplication,
  getAppliedJobs,
  getAppliedUsers,
  getPostedJobs,
  getSavedJobs,
  saveJob,
  unsaveJob,
} from "../controllers/userjob.js";

const router = express.Router();

router.post("save-job", verifyToken, saveJob);
router.post("unsave-job", verifyToken, unsaveJob);
router.get("get-saved-jobs/:id", verifyToken, getSavedJobs);
router.get("get-posted-job/:id", verifyToken, getPostedJobs);
router.post("apply-job", verifyToken, applyJob);
router.post("delete-application", verifyToken, deleteJobApplication);
router.get("get-applied-jobs/:id", verifyToken, getAppliedJobs);
router.get("get-users-job/:id", verifyToken, getAppliedUsers);

export default router;
