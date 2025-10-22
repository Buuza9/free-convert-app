import express from "express";
import multer from "multer";
import { convertVideo } from "../controllers/videoControllers.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage });

// Correct usage of upload.single() and controller
router.post("/convert", upload.single("file"), convertVideo);

export default router;
