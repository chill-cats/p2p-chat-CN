import express from "express";
import { authenticationMiddleware } from "../middlewares/authMiddleware";

const sessionRoutes = express.Router();
sessionRoutes.use(authenticationMiddleware);

sessionRoutes.post("/ping", (req, res) => {});

sessionRoutes.post("/update_connection_info", (req, res) => {});

sessionRoutes.post("/end_session", (req, res) => {});
