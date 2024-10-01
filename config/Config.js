require('dotenv').config();

module.exports = {
    development: {
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        host: process.env.HOST,
        port: process.env.PORT,
        dialect: 'postgres',
        ssl: {
            rejectUnauthorized: false // Set to true in production with a valid SSL certificate
        }
    }
};
