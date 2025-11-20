// controllers/authController.js
import Student from "../models/studentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import admin from "../utils/firebaseAdmin.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const setAuthCookie = (res, token) =>
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

export const signupWithFirebase = async (req, res) => {
  try {
    const { firebaseToken, name } = req.body;

    if (!firebaseToken || !name) {
      return res
        .status(400)
        .json({ error: "firebaseToken and name are required" });
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(firebaseToken);
    } catch (err) {
      console.error("Firebase token verify error:", err);
      return res.status(401).json({ error: "Invalid Firebase token" });
    }

    const email = decoded.email?.toLowerCase();
    const emailVerified = decoded.email_verified;

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    if (!emailVerified) {
      return res
        .status(400)
        .json({ error: "Email not verified. Please verify via the link." });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const randomPass = await bcrypt.hash(
      "firebase_managed_password_" + email,
      10
    );

    const student = await Student.create({
      name,
      email,
      password: randomPass,
    });

    const payload = { user: { id: student._id, role: student.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    setAuthCookie(res, token);

    return res.status(201).json({
      msg: "Signup successful",
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
      role: student.role,
    });
  } catch (error) {
    console.error("Signup with Firebase Error:", error);
    return res
      .status(500)
      .json({ error: "Signup failed. Try again later." });
  }
};

export const loginWithFirebase = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res
        .status(400)
        .json({ error: "firebaseToken is required" });
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(firebaseToken);
    } catch (err) {
      console.error("Firebase token verify error (login):", err);
      return res.status(401).json({ error: "Invalid Firebase token" });
    }

    const email = decoded.email?.toLowerCase();
    const emailVerified = decoded.email_verified;

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    if (!emailVerified) {
      return res
        .status(400)
        .json({ error: "Email not verified. Please verify via the link." });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        error: "Account not found. Please complete signup first.",
      });
    }

    const payload = { user: { id: student._id, role: student.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    setAuthCookie(res, token);

    return res.json({
      msg: "Login successful",
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
      role: student.role,
    });
  } catch (error) {
    console.error("Login with Firebase Error:", error);
    return res
      .status(500)
      .json({ error: "Login failed. Please try again later." });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(password, salt);

    const student = await Student.create({
      name,
      email,
      password: securePass,
    });

    return res.status(201).json({
      msg: "Signup successful",
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
      role: "student",
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Signup failed. Try again later." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, student.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = { user: { id: student._id, role: student.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      msg: "Login successful",
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Login failed. Please try again later." });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ error: "Logout failed" });
  }
};

export const createAdmin = async (req, res) => {
  try {
    if (req.body.secret !== process.env.ADMIN_CREATE_SECRET) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Admin email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const adminUser = await Student.create({
      name,
      email,
      password: hash,
      role: "admin",
    });

    return res.json({ msg: "Admin created", admin: adminUser });

  } catch (error) {
    console.error("Admin Creation Error:", error);
    return res.status(500).json({ error: "Could not create admin. Try again later." });
  }
};
