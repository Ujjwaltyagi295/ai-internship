// routes/jobRoutes.js
import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import restrictRole from "../middleware/restrictRole.js";
import { createJob, getJobs, getJobById, applyToJob } from "../controllers/jobController.js";

const router = express.Router();

// Public listing and single job view
router.get("/", getJobs);
router.get("/:id", getJobById);  //might not use

// Admin-only create
router.post("/", fetchuser, restrictRole("admin"), createJob);
// Apply (student)
router.post("/apply", fetchuser, applyToJob);

export default router;