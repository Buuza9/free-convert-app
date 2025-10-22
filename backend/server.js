import express from "express";
import cors from "cors";
import path from "path";
import videoRoutes from "./routes/videoRoutes.js";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const Port = 8080;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Serve converted files statically
app.use("/converted", express.static(path.join(__dirname, "converted")));

app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
	res.send("Your video converter website is running sucesssfully");
});

app.listen(Port, () => {
	console.log("🚀 Server running on http://localhost:8080");
});
