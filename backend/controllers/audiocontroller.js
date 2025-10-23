import ffmpeg from "fluent-ffmpeg"; // FFmpeg handles all the audio/video format conversions
import fs from "fs"; // Node's filesystem module — used to delete temporary files
import path from "path"; // Helps us manage file paths safely across systems

export const convertAudio = (req, res) => {
	try {
		//check if the file exists.
		if (!req.file) {
			return res.status(400).json({
				error: "No audio file has been uploaded",
			});
		}

		/*
        1. recieve the upoaded file from the format body (adneled by multer.)
        2. convert it into the requestd format, then save in the 'converted' folder.
        3. after saving it, the inputed file should be deletd from the 'uploads' folder.
        4. respond with a JSON object, containig a feedback message and a downloable convertd URL
        */

		//get the format from the request body
		const { format } = req.body;
		//path of the uploaded file
		const inputPath = req.file.path;
		//define a unique output file name
		const outputFileName = `${Date.now()}_converted.${format}`;
		//define a path, where the converted file need to be saved.
		const outputPath = path.join("converted", outputFileName);

		//Convert the file using FFmpeg
		ffmpeg(inputPath)
			.toFormat(format)
			.on("end", () => {
				console.log("Conversion is completed.");

				//delete the input file from 'uploads' folder
				fs.unlinkSync(inputPath);

				//respond to frontend or API client with the convertd file url
				res.status(200).json({
					message: "File has been converted successfully.",
					downloadUrl: `/converted/${outputFileName}`,
				});
			})
			.on("error", (err) => {
				console.log("An error has occured.");
				res.status(500).json({
					error: "An internal error has been occured. Plese try again.",
					details: err.message,
				});
			})
			.save(outputPath);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "An internal error has been occured.",
		});
	}
};
