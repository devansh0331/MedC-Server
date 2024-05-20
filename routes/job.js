import express from "express";
import { createJob, getAllJobs, getSingleJob } from "../controllers/job.js";

const router = express.Router();

router.post("/create-job", createJob);
router.get("/all-jobs", getAllJobs);
router.get("/single-job/:id", getSingleJob);

export default router;
