import fs from 'fs';
import path from 'path';
import multer from 'multer';

const defaultUploadDir = path.join(process.cwd(), 'uploads', 'resumes');
const uploadDir = process.env.RESUME_UPLOAD_DIR
  ? path.resolve(process.env.RESUME_UPLOAD_DIR)
  : defaultUploadDir;

const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      ensureUploadDir();
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const studentId = req.user?.id || 'anonymous';
    const timestamp = Date.now();
    const extension = path.extname(file.originalname) || '.pdf';
    cb(null, `${studentId}-${timestamp}${extension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF resumes are supported right now'));
  }
  cb(null, true);
};

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
