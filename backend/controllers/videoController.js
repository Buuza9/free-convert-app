import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const convertVideo = (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		// Check for desired format in request
		const { format } = req.body;
		if (!format) {
			return res.status(400).json({ error: "Output format is required" });
		}

		const inputPath = path.join(__dirname, "../uploads", req.file.filename);

		// Get the file name without extension
		const baseName = path.parse(req.file.originalname).name;

		// Build output filename dynamically based on requested format
		const outputFileName = `${Date.now()}_${baseName}_converted.${format}`;
		const outputPath = path.join(__dirname, "../converted", outputFileName);

		// Use ffmpeg to convert to the chosen format
		const command = `ffmpeg -i "${inputPath}" "${outputPath}"`;

		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error("FFmpeg error:", stderr);
				return res.status(500).json({ error: "Conversion failed" });
			}

			// Optionally delete input file after conversion
			fs.unlinkSync(inputPath);

			res.json({
				message: "Conversion successful",
				fileUrl: `/converted/${outputFileName}`,
			});
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};
