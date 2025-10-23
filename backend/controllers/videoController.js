import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Ffmpeg from "fluent-ffmpeg";
import { getOutputFolder } from "../utils/getOutputFolder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const convertVideo = (req, res) => {
	try {
		if (!req.file)
			return res.status(400).json({ error: "No file uploaded" });
		const { format } = req.body;

		if (!format)
			return res.status(400).json({ error: "Output format is required" });

		const inputPath = req.file.path;
		const baseName = path.parse(req.file.originalname).name;

		// Dynamic folder based on target format
		const outputFolder = getOutputFolder(format);
		const outputFileName = `${Date.now()}_${baseName}_converted.${format}`;
		const outputPath = path.join(outputFolder, outputFileName);

		Ffmpeg(inputPath)
			.toFormat(format)
			.on("end", () => {
				console.log("File conversion completed.");
				fs.unlinkSync(inputPath); // delete original file
				res.json({
					message: "File has been converted successfully.",
					downloadUrl: `/converted/${path.basename(
						outputFolder
					)}/${outputFileName}`,
				});
			})
			.on("error", (err) => {
				console.error("FFmpeg error:", err);
				res.status(500).json({
					error: "Conversion failed",
					details: err.message,
				});
			})
			.save(outputPath);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};
