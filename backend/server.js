import express from "express";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes.js";
import bodyParser from "body-parser";

const app = express();
const Port = 8080;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/converted", express.static("converted"));
app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
	res.send("Your video converter website is running sucesssfully");
});

app.listen(Port, () => {
	console.log("🚀 Server running on http://localhost:8080");
});
