import express from "express";
import { dbConnection } from "../clients/db.js";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";

const friendRoutes = express.Router();
friendRoutes.use(authenticationMiddleware);

friendRoutes.post("/add", (req, res) => {});

friendRoutes.post("/remove", (req, res) => {});

friendRoutes.get("/my", async (req, res) => {
    const { username } = req.user;
    const friends = await dbConnection.execute(
        `
    SELECT K.\`Username\` as username, session.IP as ip, session.port, session.isActive as is_active FROM (SELECT * FROM \`user\` U
    LEFT JOIN \`friendship\` F
    ON U.\`Username\` = F.\`userB\`
    WHERE F.\`userA\` = ?
    UNION
    SELECT * FROM \`user\` U
    LEFT JOIN \`friendship\` F
    ON U.\`Username\` = F.\`userA\`
    WHERE F.\`userB\` = ?) K LEFT JOIN \`session\` ON K.username = session.\`Username\``,
        [username, username]
    );

    res.status(200).json({
        status: "OK",
        friend_count: friends.length,
        friends,
    });
});

friendRoutes.get("/:friendID", (req, res) => {});

export { friendRoutes };
