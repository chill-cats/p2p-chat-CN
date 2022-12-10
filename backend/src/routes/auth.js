import express from "express";
import { dbConnection } from "../clients/db.js";
import argon2 from "argon2";
import cryptoRandomString from "crypto-random-string";
import { SqlError } from "mariadb";

const authRoutes = express.Router();

function generateID(length) {
    return cryptoRandomString({ length });
}

authRoutes.post("/login", async (req, res) => {
    if (!req.body.username) {
        res.status(400).json({
            status: "NOT OK",
            location: "username",
            error: "Username is required",
        });
        return;
    }
    if (!req.body.password) {
        res.status(400).json({
            status: "NOT OK",
            location: "password",
            error: "Password is required",
        });
        return;
    }

    const { username, password } = req.body;
    const session = await dbConnection.execute(
        "SELECT * FROM `session` WHERE `session`.`Username` = ?",
        [username]
    );
    if (session.length > 0) {
        res.status(403).json({
            status: "NOT OK",
            location: "username",
            error: "User is alreay logged in, try logging out on other device first",
        });
        return;
    }

    const result = await dbConnection.execute(
        "SELECT * FROM `user` WHERE `Username` = ?",
        [username]
    );
    if (result.length === 0) {
        res.status(401).json({
            status: "NOT OK",
            location: "username",
            error: "Username does not exist",
        });
        return;
    }
    const user = result[0];
    const passwordIsMatch = await argon2.verify(user.Password, password);

    if (!passwordIsMatch) {
        res.status(401).json({
            status: "NOT OK",
            location: "password",
            error: "Password is not correct",
        });
        return;
    }
    const sessionID = generateID(16);
    await dbConnection.execute(
        "INSERT INTO `session` (`SessionID`, `Username`) VALUES (?, ?)",
        [sessionID, user.Username]
    );

    console.log(`User ${user.Username} logged in with SessionID: ${sessionID}`);

    res.status(200).json({
        status: "OK",
        token: sessionID,
        username: user.Username,
    });
    return;
});

authRoutes.post("/register", async (req, res) => {
    if (!req.body.username) {
        res.status(400).json({
            status: "NOT OK",
            location: "username",
            error: "Username is required",
        });
        return;
    }
    if (!req.body.password) {
        res.status(400).json({
            status: "NOT OK",
            location: "password",
            error: "Password is required",
        });
        return;
    }

    const { username, password } = req.body;
    const ID = generateID(6);
    const hashedPassword = await argon2.hash(password);
    try {
        await dbConnection.execute("INSERT INTO `user` VALUES (?, ?, ?)", [
            ID,
            username,
            hashedPassword,
        ]);
        console.log(`Created user ${username}`);

        res.status(201).json({ status: "OK" });
        return;
    } catch (e) {
        if (!(e instanceof SqlError)) {
            throw e;
        }
        if (e.code !== "ER_DUP_ENTRY") {
            throw e;
        }
        res.status(409).json({
            status: "NOT OK",
            location: "username",
            error: "Username already in use",
        });
        return;
    }
});

export { authRoutes };
