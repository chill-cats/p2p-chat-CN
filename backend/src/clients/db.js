import mariadb from "mariadb";

const { DB_IP, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

export const dbConnection = mariadb.createPool({
    host: DB_IP,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "p2p-chat",
    connectionLimit: 5,
});
