import express from "express";
import { SqlError } from "mariadb";
import { dbConnection } from "../clients/db.js";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";

const friendRoutes = express.Router();
friendRoutes.use(authenticationMiddleware);

friendRoutes.post("/add", async (req, res) => {
    const username = req.body.username;
    if (!username) {
        res.status(400).json({
            status: "NOT OK",
            error: "other user username is required",
        });
        return;
    }
    if (username === req.user.username) {
        res.status(400).json({
            status: "NOT OK",
            error: "Cannot make friend with yourself",
        });
        return;
    }
    try {
        const friends = await dbConnection.execute(
            `
    SELECT K.\`Username\` as username, session.IP as ip, session.port, last_update FROM (SELECT * FROM \`user\` U
    LEFT JOIN \`friendship\` F
    ON U.\`Username\` = F.\`userB\`
    WHERE F.\`userA\` = ?
    UNION
    SELECT * FROM \`user\` U
    LEFT JOIN \`friendship\` F
    ON U.\`Username\` = F.\`userA\`
    WHERE F.\`userB\` = ?) K LEFT JOIN \`session\` ON K.username = session.\`Username\``,
            [req.user.username, req.user.username]
        );
        if (friends.find((f) => f.username === username)) {
            res.status(400).json({
                status: "NOT OK",
                error: "You are already friend",
            });
            return;
        }

        await dbConnection.execute(
            "INSERT INTO friendship(`userA`, `userB`) VALUES (?, ?)",
            [username, req.user.username]
        );
    } catch (e) {
        if (e instanceof SqlError) {
            if (e.code === "ER_DUP_ENTRY") {
                res.status(400).json({
                    status: "NOT OK",
                    error: "You are already friend",
                });
            }
        }
    }

    return res.status(200).send();
});

friendRoutes.post("/remove", (req, res) => {});

friendRoutes.post("/search", async (req, res) => {
    const username = req.body.username;
    if (!username) {
        res.status(400).json({
            status: "NOT OK",
            error: "username is required",
        });
        return;
    }
    const users = await dbConnection.execute(
        "SELECT `Username` from user WHERE `Username` = ?",
        [username]
    );
    res.status(200).json({
        status: "OK",
        data: {
            user_count: users.length,
            users,
        },
    });
});

friendRoutes.get("/my", async (req, res) => {
    const { username } = req.user;
    const friends = await dbConnection.execute(
        `
    SELECT K.\`Username\` as username, session.IP as ip, session.port, last_update FROM (SELECT * FROM \`user\` U
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
