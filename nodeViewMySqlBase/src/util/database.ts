import { Sequelize, Dialect } from "sequelize";

//env variables
const dbName = (process.env.DB_NAME as string) ?? "test";
const dbUser = (process.env.DB_USER as string) ?? "test";
const dbPassword = process.env.DB_PASSWORD ?? "test";

const dbHost = (process.env.DB_HOST as string) ?? "localhost";
const dbDriver = (process.env.DB_DRIVER as Dialect) ?? "mysql";

//connection to the mysql DB
const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
});

export default sequelizeConnection;
