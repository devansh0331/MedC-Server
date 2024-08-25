import express from "express";
import {
  deleteReport,
  getReportedProfiles,
  getSingleReportedProfile,
  getSingleReportedProfileReasons,
  reportProfile,
} from "../controllers/report.js";

const router = express.Router();

router.post("/add-report/:id", reportProfile);
router.get("/all-reports", getReportedProfiles);
router.post("/delete-report/:id", deleteReport);
router.get("/single-report/:id", getSingleReportedProfileReasons);

export default router;
