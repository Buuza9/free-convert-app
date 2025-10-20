// server.js

import express from "express";
import cors from "cors";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Helper to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Set up storage for uploaded files
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage });

// Serve converted files statically
app.use("/converted", express.static(path.join(__dirname, "converted")));

app.get("/", (req, res) => {
	res.send("Your video converter website is running sucessfully");
});

// Main conversion route
app.post("/convert", upload.single("file"), (req, res) => {
	const { format } = req.body;
	const inputPath = req.file.path;
	const outputFileName = `${Date.now()}.${format}`;
	const outputPath = path.join(__dirname, "converted", outputFileName);

	ffmpeg(inputPath)
		.toFormat(format)
		.on("end", () => {
			fs.unlinkSync(inputPath); // delete uploaded file after conversion
			res.json({ downloadUrl: `/converted/${outputFileName}` });
		})
		.on("error", (err) => {
			console.error("FFmpeg error:", err);
			res.status(500).json({ error: "Conversion failed" });
		})
		.save(outputPath);
});

app.listen(8080, () => {
	console.log("🚀 Server running on http://localhost:8080");
});
