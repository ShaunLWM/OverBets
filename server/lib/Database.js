const mysql = require("mysql2/promise");
require("dotenv").config();
const { uuid } = require("uuidv4");

class Database {
    async connect() {
        this.connection = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DB,
        });
    }

    async checkConnect() {
        if (typeof this.connection === "undefined") await this.connect();
    }

    async getMatches(ended = 0) {
        await this.checkConnect();
        const [rows] = await this.connection.execute("SELECT * FROM matches m WHERE m.match_ended = ? ORDER BY UNIX_TIMESTAMP(m.match_id) ASC", [ended]);
        return rows;
    }

    /**
     * Get match details from matchId
     * Returns 2 teams, odds etc
     */
    async getMatch(matchId) {
        await this.checkConnect();
        const [rows, fields] = await this.connection.execute("SELECT * FROM match WHERE match_ended = 0");
    }

    async getBets(matchId, count = 8) {
        await this.checkConnect();
        const [rows] = await this.connection.execute("SELECT * FROM bet b LEFT JOIN user u ON b.bet_userId = u.user_id  WHERE b.bet_matchId = ? ORDER BY b.bet_id DESC LIMIT ?", [matchId, count]);
        return rows;
    }

    async getTeam(teamId) {
        await this.checkConnect();
        const [rows] = await this.connection.execute("SELECT * FROM team WHERE team_id = ?", [teamId]);
        return rows;
    }

    async checkBet({ uid, mid }) {
        await this.checkConnect();
        const [rows] = await this.connection.execute("SELECT bet_id FROM bet WHERE bet_userId = ? AND bet_matchId = ?", [uid, mid]);
        return rows.length > 0;
    }

    async addBet({ uid, mid, coins, side }) {
        await this.checkConnect();
        const uniq = uuid();
        await this.connection.execute(
            "INSERT INTO `bet` (`bet_id`, `bet_uid`, `bet_userId`, `bet_datetime`, `bet_matchId`, `bet_teamSide`, `bet_amount`) VALUES (NULL,?,?, NOW(),?,?,?);",
            [uniq, uid, mid, side, coins]);
        return uniq;
    }

    async getUser(id) {
        await this.checkConnect();
        const [rows] = await this.connection.execute("SELECT * FROM user WHERE user_battletag = ?", id);
        if (rows.length === 0) return false;
        return rows[0];
    }

    async addUser(id) {
        await this.checkConnect();
        await this.connection.execute("INSERT INTO `user` (`user_id`, `user_battletag`, `user_dateregistered`, `user_coins`) VALUES (NULL, ?, NOW(), '100');", [id]);
        return true;
    }
}

module.exports = new Database();
