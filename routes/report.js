import express from "express";
import {
  deleteReport,
  getReportedProfiles,
  reportProfile,
} from "../controllers/report.js";

const router = express.Router();

router.post("/add-report/:id", reportProfile);
router.get("/all-reports", getReportedProfiles);
router.post("/delete-report/:id", deleteReport);

export default router;
