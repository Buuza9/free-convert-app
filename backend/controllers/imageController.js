import path from "path";
import fs from "fs";
import Ffmpeg from "fluent-ffmpeg";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map input formats to FFmpeg-compatible formats
const FORMAT_MAP = {
	jpg: "mjpeg",
	jpeg: "mjpeg",
	png: "png",
	bmp: "bmp",
	webp: "webp",
};

// Base folders
const CONVERTED_FOLDER = path.join(__dirname, "../converted");

// Ensure base converted folder exists
if (!fs.existsSync(CONVERTED_FOLDER))
	fs.mkdirSync(CONVERTED_FOLDER, { recursive: true });

export const convertImage = (req, res) => {
	try {
		if (!req.file)
			return res.status(400).json({ error: "No file uploaded." });

		let { format } = req.body;
		if (!format)
			return res
				.status(400)
				.json({ error: "Output format is required." });

		format = format.toLowerCase();

		if (!(format in FORMAT_MAP)) {
			return res.status(400).json({
				error: "Unsupported format.",
				supportedFormats: Object.keys(FORMAT_MAP),
			});
		}

		const ffmpegFormat = FORMAT_MAP[format];
		const inputPath = req.file.path;
		const baseName = path.parse(req.file.originalname).name;

		// Create format-specific folder in converted/image/
		const formatFolder = path.join(CONVERTED_FOLDER, "image", format);
		if (!fs.existsSync(formatFolder))
			fs.mkdirSync(formatFolder, { recursive: true });

		const outputFileName = `${Date.now()}_${baseName}_converted.${format}`;
		const outputPath = path.join(formatFolder, outputFileName);

		// Perform conversion
		Ffmpeg(inputPath)
			.toFormat(ffmpegFormat)
			.on("end", () => {
				console.log("Image converted successfully");

				// Remove uploaded file
				fs.unlinkSync(inputPath);

				res.status(200).json({
					message: "Image converted successfully.",
					downloadUrl: `/converted/image/${format}/${outputFileName}`,
				});
			})
			.on("error", (err) => {
				console.error("Conversion error:", err);
				if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

				res.status(500).json({
					error: "Error during conversion.",
					details: err.message,
				});
			})
			.save(outputPath);
	} catch (error) {
		console.error("Internal error:", error);
		res.status(500).json({
			error: "Internal server error.",
			details: error.message,
		});
	}
};
