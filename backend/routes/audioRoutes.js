import express from "express";
import { upload } from "../config/uploadConfig.js";
import { convertAudio } from "../controllers/audioController.js";

const router = express.Router();

/* 
Configure multer for uploading files.
{
    destination: folder where uploaded files are temperarely stored 
    filename: Rename file wiht time stamo to. avaoid name collisions
}
*/

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "uploads/");
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, `${Date.now()}-${file.originalname}`);
// 	},
// });

// const upload = multer({ storage });

/**
 * Defien API endpoint for audio conversion
 * Requests:
 *  - Body field (format): the desired output format (eg. mp3, wav)
 *  - File field (file): the uploaded audio file
 * Response:
 *  - JSON containing 'downloadUrl' for the converted file
 */
router.post("/convert", upload.single("file"), convertAudio);

export default router;
