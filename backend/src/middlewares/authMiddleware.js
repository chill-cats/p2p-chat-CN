import { dbConnection } from "../clients/db.js";
async function authenticationMiddleware(req, res, next) {
    const authenticationHeader = req.header("Authorization");
    if (!authenticationHeader) {
        res.status(401).json({
            status: "NOT OK",
            error: "Authorization header is required",
        });
        return;
    }

    const queryResult = await dbConnection.execute(
        "SELECT `user`.`Username` as username, `user`.`ID` FROM `session` JOIN `user` ON `session`.`Username`=`user`.`Username` WHERE `session`.`SessionID` = ?",
        [authenticationHeader]
    );

    if (queryResult.length === 0) {
        res.status(401).json({
            status: "NOT OK",
            error: "Invalid SessionID",
        });
        return;
    }

    req.user = queryResult[0];
    return next();
}

export { authenticationMiddleware };
