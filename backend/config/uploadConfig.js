import multer from "multer";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const getUploadFolder = (file) => {
	const mimeType = file.mimetype.split("/")[0];
	switch (mimeType) {
		case "audio":
			return path.join(__dirname, "../uploads/audio");
		case "video":
			return path.join(__dirname, "../uploads/video");
		case "image":
			return path.join(__dirname, "../uploads/image");
		default:
			return path.join(__dirname, "../uploads/others");
	}
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const folder = getUploadFolder(file);
		if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
		cb(null, folder);
	},
	filename: (req, file, cb) => {
		const timestamp = Date.now();
		const ext = path.extname(file.originalname);
		const name = path.basename(file.originalname, ext);
		cb(null, `${name}-${timestamp}${ext}`);
	},
});

export const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const allowedTypes = ["audio", "video", "image"];
		const mimeType = file.mimetype.split("/")[0];
		if (allowedTypes.includes(mimeType)) cb(null, true);
		else cb(new Error("Unsupported file type"), false);
	},
});
