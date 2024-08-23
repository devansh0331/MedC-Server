import express from "express";
import { getReportedProfiles, reportProfile } from "../controllers/report.js";

const router = express.Router();

router.post("/add-report/:id", reportProfile);
router.get("/all-reports", getReportedProfiles);

export default router;
