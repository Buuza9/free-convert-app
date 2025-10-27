import path from "path";
import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const getOutputFolder = (format) => {
	// Map format to type
	const videoFormats = ["mp4", "mov", "avi", "mkv", "flv"];
	const audioFormats = ["mp3", "wav", "aac", "flac"];
	const imageFormats = ["jpg", "png", "gif", "webp"];

	let folderType;

	if (videoFormats.includes(format.toLowerCase())) folderType = "video";
	else if (audioFormats.includes(format.toLowerCase())) folderType = "audio";
	else if (imageFormats.includes(format.toLowerCase())) folderType = "image";
	else folderType = "others";

	// Ensure folder exists
	const folderPath = path.join(__dirname, "../converted", folderType);
	if (!fs.existsSync(folderPath))
		fs.mkdirSync(folderPath, { recursive: true });

	return folderPath;
};

export default getOutputFolder;
