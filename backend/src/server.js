import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.js";
import { friendRoutes } from "./routes/friend.js";
import { sessionRoutes } from "./routes/session.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/friend", friendRoutes);
app.use("/session", sessionRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Listening on port: ${PORT}`);
});
