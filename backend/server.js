import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js";
import characterRoutes from "./routes/character.route.js";
import noteRoutes from "./routes/note.route.js";
import eventRoutes from "./routes/event.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://storytimewithclemons.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json()); // allows us to accept JSON data in the req.body

app.use("/api/user", userRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notes", noteRoutes);

//if (process.env.NODE_ENV === "production") {
//app.use(express.static(path.join(__dirname, "../frontend/dist")));
//app.get("*", (req, res) => {
//res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
//});
//}

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at " + PORT);
});
