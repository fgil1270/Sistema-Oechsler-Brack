import { registerAs } from "@nestjs/config";

export default registerAs('config', () => {
    return {
        database: {
            name: process.env.DATABASE_NAME,
            port: process.env.DATABASE_PORT,
        },
        mysql:{
            dbName: process.env.MYSQL_DATABASE,
            port: parseInt(process.env.MYSQL_PORT, 10),
            password: process.env.MYSQL_ROOT_PASSWORD,
            user: process.env.MYSQL_USER,
            host: process.env.MYSQL_HOST,
        },
        apiKey: process.env.API_KEY,
        jwtSecret: process.env.JWT_SECRET
    };
});