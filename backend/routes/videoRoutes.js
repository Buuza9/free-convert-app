import express from "express";
import multer from "multer";
import { upload } from "../config/uploadConfig.js";
import { convertVideo } from "../controllers/videoController.js";

const router = express.Router();

// Correct usage of upload.single() and controller
router.post("/convert", upload.single("file"), convertVideo);

export default router;
