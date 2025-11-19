// controllers/authController.js
import Student from "../models/studentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  try {
    const { name, universityEmail, password } = req.body;

    if (!name || !universityEmail || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Student.findOne({ universityEmail });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(password, salt);

    const student = await Student.create({
      name,
      universityEmail,
      password: securePass,
    });

    const payload = { user: { id: student._id } };
    const token = jwt.sign(payload, JWT_SECRET);

    res.json({
      msg: "Signup successful",
      token,
      user: {
        id: student._id,
        name: student.name,
        universityEmail: student.universityEmail,
      },
      role: "student",
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { universityEmail, password } = req.body;

    if (!universityEmail || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const student = await Student.findOne({ universityEmail });
    if (!student) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, student.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = { user: { id: student._id, role: student.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: student._id,
        name: student.name,
        universityEmail: student.universityEmail,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


export const createAdmin = async (req, res) => {
  if (req.body.secret !== process.env.ADMIN_CREATE_SECRET) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { name, universityEmail, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const admin = await Student.create({
    name,
    universityEmail,
    password: hash,
    role: "admin",
  });

  res.json({ msg: "Admin created", admin });
};

