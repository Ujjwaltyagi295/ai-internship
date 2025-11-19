// routes/authRoutes.js
import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import { signup, login, createAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/create-admin", createAdmin);

router.get("/me", fetchuser, (req, res) => {
  res.json({ userId: req.user.id });
});

export default router;
