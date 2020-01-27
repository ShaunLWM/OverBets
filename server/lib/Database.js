const mysql = require("mysql2/promise");
require("dotenv").config();
const { uuid } = require("uuidv4");

class Database {
    constructor() {
        this.connect();
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
        // const[rows, fields] = await connection.execute("SELECT * FROM `table` WHERE `name` = ? AND `age` > ?", ["Morty", 14]);
    }

    /**
     * Get match details from matchId
     * Returns 2 teams, odds etc
     */
    async getMatch(matchId) {
        const [rows, fields] = await this.connection.query("SELECT * FROM match WHERE match_ended = 0");
    }

    async getTeam(teamId) {

    }

    async getBets() {

    }

    async checkBet({ uid, mid }) {
        const [rows] = await this.connection.query("SELECT bet_id FROM bet WHERE bet_userId = ? AND bet_matchId = ?", [uid, mid]);
        return rows.length > 0;
    }

    async addBet({ uid, mid, coins, side }) {
        const uniq = uuid();
        await this.connection.query(
            "INSERT INTO `bet` (`bet_id`, `bet_uid`, `bet_userId`, `bet_datetime`, `bet_matchId`, `bet_teamSide`, `bet_amount`) VALUES (NULL,?,?, NOW(),?,?,?);",
            [uniq, uid, mid, side, coins]);
        return uniq;
    }

    async getUser(id) {
        const [rows] = await this.connection.query("SELECT * FROM user WHERE user_battletag = ?", id);
        if (rows.length === 0) return false;
        return rows[0];
    }

    async addUser(id) {
        await this.connection.query("INSERT INTO `user` (`user_id`, `user_battletag`, `user_dateregistered`, `user_coins`) VALUES (NULL, ?, NOW(), "100");", [id]);
        return true;
    }
}

module.exports = new Database();
