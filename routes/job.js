import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getSingleJob,
} from "../controllers/job.js";

const router = express.Router();

router.post("/create-job", createJob);
router.get("/all-jobs", getAllJobs);
router.get("/single-job/:id", getSingleJob);
router.post("/delete-job/:id", deleteJob);

export default router;
