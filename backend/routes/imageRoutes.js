import express from "express";
import { upload } from "../config/uploadConfig.js";
import { convertImage } from "../controllers/imageController.js";

const router = express.Router();

router.post("/convert", upload.single("file"), convertImage);

export default router;
