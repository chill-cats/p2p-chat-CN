import express from "express";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";
import { dbConnection } from "../clients/db.js";
import moment from "moment";

const sessionRoutes = express.Router();
sessionRoutes.use(authenticationMiddleware);

sessionRoutes.post("/ping", async (req, res) => {
    await dbConnection.execute(
        "UPDATE session SET last_update = ? WHERE `Username` = ?",
        [moment().format("YYYY-MM-DD HH:mm:ss"), req.user.username]
    );
    res.status(200).send();
});

sessionRoutes.post("/update_connection_info", async (req, res) => {
    const username = req.user.username;
    const ip = req.body.ip_address;
    const port = req.body.port;
    console.log(req.body);
    if (!ip || !port) {
        res.status(400).json({
            status: "NOT OK",
            error: "IP and Port field are required",
        });
        return;
    }

    await dbConnection.execute(
        "UPDATE session SET ip = ?, port = ? WHERE `Username` = ?",
        [ip, port, req.user.username]
    );
    res.status(200).json({ status: "OK" });
});

sessionRoutes.post("/end", async (req, res) => {
    await dbConnection.execute("DELETE FROM session WHERE `Username` = ?", [
        req.user.username,
    ]);
    return res.status(200).send();
});

export { sessionRoutes };
