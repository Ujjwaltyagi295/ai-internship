// routes/authRoutes.js
import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import { signup, login, logout, createAdmin } from "../controllers/authController.js";
import { signupWithFirebase } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupWithFirebase);
router.post("/login", login);
router.post("/logout", logout);
router.post("/create-admin", createAdmin);

// This route is protected by fetchuser middleware
router.get("/me", fetchuser, (req, res) => {
  res.json({ 
    userId: req.user.id,
    role: req.user.role 
  }); 
});

export default router;
