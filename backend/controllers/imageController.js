import path from "path";
import fs from "fs";
import getOutputFolder from "../config/uploadConfig";
import Ffmpeg from "fluent-ffmpeg";

export const convertImage = (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				error: "No file uploaded.",
			});
		}

		//Get the format form the request body
		const { format } = req.body;

		if (!format) {
			return res.status(400).json({
				error: "Output format is required.",
			});
		}

		const inputPath = req.file.path;
		const baseName = path.parse(req.file.originalname).name;

		//Dynamic folder base do nthe targetd fomrat
		const outputFolder = getOutputFolder(format);
		const outputFileName = `${Date.now()}_${baseName}_converted.${format}`;
		const outputPath = path.join(outputFolder, outputFileName);

		//Convert the image to the targeted format.
		Ffmpeg(inputPath)
			.toFormat(format)
			.on("end", () => {
				console.log("Image has been converted successfully");

				//remove image from uploads file
				fs.unlinkSync(inputPath);

				//respond to frontend or API client with feedback message and converted URL
				res.status(200).json({
					message: "Image converted successfully.",
					downloadUrl: `/converted/${path.basename(
						outputFolder
					)}/${outputFileName}`,
				});
			})
			.on("error", (err) => {
				console.error("An errro has occured.", err);
				res.status(500).json({
					error: "An error has occured.",
					details: err.message,
				});
			})
			.save(outputPath);
	} catch (error) {
		console.log(`An errro occured. ${error}`);
	}
};
