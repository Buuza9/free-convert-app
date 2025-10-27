import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Ffmpeg from "fluent-ffmpeg";
import { getOutputFolder } from "../utils/getOutputFolder.js";

const __filename = fileURLToPath(import.meta.url);

export const convertVideo = (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				error: "No file uploaded.",
			});
		}

		const { format } = req.body;

		if (!format) {
			return res.status(400).json({
				error: "Output format is required.",
			});
		}

		const inputPath = req.file.path;
		const baseName = path.parse(req.file.originalname).name;

		const outputFolder = getOutputFolder(format);
		const outputFileName = `${Date.now()}_${baseName}_converted.${format}`;
		const outputPath = path.join(outputFolder, outputFileName);

		Ffmpeg(inputPath)
			.toFormat(format)
			.on("end", () => {
				console.log("File conversion is completed.");
				fs.unlinkSync(inputPath);
				res.json({
					message: "File has been convertd succesfully.",
					downloadUrl: `/converted/${path.basename(
						outputFolder
					)}/${outputFileName}`,
				});
			})
			.on("error", (err) => {
				console.error("Ffmpeg error: ", err);
				res.status(500).json({
					error: "Conversion failed. Plase try again.",
					details: err.message,
				});
			})
			.save(outputPath);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: "An internal error occured.",
		});
	}
};
