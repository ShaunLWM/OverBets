const avatars = require("./avatar.json");
const mysql = require("mysql2/promise");
require("dotenv").config();

(async () => {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
    });

    for (let [key, value] of Object.entries(avatars)) {
        const [rows] = await connection.query("SELECT * FROM avatar WHERE avatar_key = ?", [key]);
        if (rows.length > 0) {
            if (rows[0]["avatar_img"] === value["icon"]) {
                console.log(`[^] updating: ${key}`);
                await connection.execute("UPDATE avatar SET avatar_img = ? WHERE avatar_key = ?", [value["icon"], key]);
            }
        } else {
            console.log(`[+] inserting new avatar ${key}`);
            await connection.execute("INSERT INTO avatar (avatar_key, avatar_img) VALUES (?,?)", [key, value["icon"]]);
        }
    }
})();
