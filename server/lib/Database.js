const mysql = require("mysql2/promise");
require("dotenv").config();

class Database {
    constructor() {

    }

    async connect() {
        this.connection = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DB,
        });
    }

    async getMatches() {
        return null;
        // const[rows, fields] = await connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);
    }

    /**
     * Get match details from matchId
     * Returns 2 teams, odds etc
     */
    async getMatch(matchId) {
        const [rows, fields] = await this.connection.execute("SELECT * FROM match WHERE match_ended = 0");
    }

    async getTeam(teamId) {

    }

    async getBets() {

    }

    async getUser(id) {

    }
}

module.exports = new Database();
