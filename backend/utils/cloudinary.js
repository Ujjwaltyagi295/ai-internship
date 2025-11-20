// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// This automatically reads CLOUDINARY_URL from your .env
cloudinary.config({
  secure: true,  // optional but recommended
});

export default cloudinary;