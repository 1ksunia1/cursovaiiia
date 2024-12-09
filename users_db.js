require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    database: "postgres",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
    connectionTimeoutMillis: 5000, // Увеличьте тайм-аут соединения
});

const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(5) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user'))
        )
    `;

    try {
        await pool.query(query);
        console.log('Таблица пользователей успешно создана или уже существует.');
    } catch (error) {
        console.error("Ошибка при создании таблицы пользователей:", error.message);
        console.error("Детали ошибки:", error);
    }
};

createUsersTable();

process.on("SIGINT", async () => {
    await pool.end();
});

module.exports = pool;