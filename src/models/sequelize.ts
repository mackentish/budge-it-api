import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = (process.env.DB_PORT || 3306) as number;
const USER = process.env.DB_USER!;
const PASSWORD = process.env.DB_PASSWORD!;
const DATABASE = process.env.DB_NAME || 'budge-it';

// Connect to mysql database using sequelize
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    host: HOST,
    port: DB_PORT,
    dialect: 'mysql',
    dialectOptions: { decimalNumbers: true },
    logging: false, // TODO: log to a cloud resource when deployed
});

export default sequelize;
