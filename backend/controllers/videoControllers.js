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

		const inputPath = path.join(__dirname, "../uploads", req.file.filename);
		const outputFileName = `${Date.now()}_converted.mp4`;
		const outputPath = path.join(__dirname, "../converted", outputFileName);

		// Example using ffmpeg for video conversion
		const command = `ffmpeg -i "${inputPath}" -c:v libx264 "${outputPath}"`;

		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error("FFmpeg error:", stderr);
				return res.status(500).json({ error: "Conversion failed" });
			}

			// Delete input file if you want
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
