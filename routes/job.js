import express from "express";
import {
  createJob,
  deleteJob,
  editJob,
  getAllJobs,
  getSingleJob,
} from "../controllers/job.js";

const router = express.Router();

router.post("/create-job", createJob);
router.get("/all-jobs", getAllJobs);
router.get("/single-job/:id", getSingleJob);
router.post("/delete-job/:id", deleteJob);
router.post("/edit-job/:id", editJob);

export default router;
