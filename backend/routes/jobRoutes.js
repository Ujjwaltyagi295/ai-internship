// routes/jobRoutes.js
import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import restrictRole from "../middleware/restrictRole.js";
import { createJob, getJobs, getJobById, applyToJob, createJobFromText } from "../controllers/jobController.js";

const router = express.Router();
router.post("/apply", fetchuser, applyToJob);
// Public listing and single job view
router.get("/", getJobs);
router.post("/:id", getJobById);  //might not use

// Admin-only create
router.post("/", fetchuser, restrictRole("admin"), createJob);
// Apply (student)
router.post("/autocreate", createJobFromText);
export default router;