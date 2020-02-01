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
        const [rows] = await this.connection.query("SELECT * FROM matches m WHERE m.match_ended = ? ORDER BY UNIX_TIMESTAMP(m.match_id) ASC", [ended]);
        return rows;
    }

    async getBets(matchId, count = 6) {
        await this.checkConnect();
        const [rows] = await this.connection.query("SELECT * FROM bet b LEFT JOIN user u ON b.bet_userId = u.user_id WHERE b.bet_matchId = ? ORDER BY b.bet_id DESC LIMIT ?", [matchId, count]);
        return rows;
    }

    async getSumBets(matchId, side) {
        await this.checkConnect();
        const [rows] = await this.connection.query("SELECT SUM(bet_amount) as total FROM bet WHERE bet_matchId = ? AND bet_side = ?", [matchId, side]);
        return rows[0].total === null ? 0 : Number(rows[0].total);
    }

    async getPureBets(matchId, side) {
        await this.checkConnect();
        const [rows] = await this.connection.query("SELECT bet_amount FROM bet WHERE bet_matchId = ? AND bet_side = ?", [matchId, side]);
        return rows;
    }

    async getTeam(teamId) {
        await this.checkConnect();
        const [rows] = await this.connection.query("SELECT * FROM team WHERE team_id = ?", [teamId]);
        return rows[0];
    }

    async checkBet({ uid, mid }) {
        await this.checkConnect();
        const [rows] = await this.connection.query("SELECT bet_id FROM bet WHERE bet_userId = ? AND bet_matchId = ?", [uid, mid]);
        return rows.length > 0;
    }

    async addBet({ uid, mid, coins, side }) {
        await this.checkConnect();
        const uniq = uuid();
        const [rows] = await this.connection.execute(
            "INSERT INTO `bet` (`bet_id`, `bet_uid`, `bet_userId`, `bet_datetime`, `bet_matchId`, `bet_side`, `bet_amount`) VALUES (NULL,?,?, NOW(),?,?,?);",
            [uniq, uid, mid, side, coins]);
        return rows.affectedRows === 1;
    }

    async getUser(tag) {
        await this.checkConnect();
        const [rows] = await this.connection.query("SELECT * FROM user WHERE user_battletag = ?", [tag]);
        if (rows.length === 0) return false;
        return rows[0];
    }

    async addUser({ tag, img }) {
        await this.checkConnect();
        await this.connection.execute("INSERT INTO `user` (`user_id`, `user_battletag`, `user_dateregistered`, `user_coins`, `user_image`) VALUES (NULL, ?, NOW(), '100', ?);", [tag, img]);
        return true;
    }

    async getUserBetsHistory(tag) {
        await this.checkConnect();
        const [rows] = await this.connection.execute("SELECT b.* FROM bet b INNER JOIN matches m ON b.bet_matchId = m.match_id INNER JOIN user u ON b.bet_userId = u.user_id WHERE u.user_battletag = ? ORDER BY b.bet_id DESC", [tag]);
        return rows;
    }

    async getProfile(id) {
        await this.checkConnect();
        const [rows] = await this.connection.query("SELECT * FROM user WHERE user_id = ?", [id]);
        return rows.length === 0 ? false : rows[0];
    }

    async editCoins({ uid, amount = 0, add = false }) {
        await this.checkConnect();
        this.connection.execute(`UPDATE user SET user_coins = user_coins ${add ? `+` : `-`} ? WHERE user_id = ?`, [Number(amount), uid])
    }

    async addLogs({ type, admin = 1, data }) {
        await this.checkConnect();
        this.connection.execute("INSERT INTO `logs` (`history_type`, `history_admin`, `history_data`) VALUES (?, ?, ?);", [type, admin, data]);
    }
}

module.exports = new Database();
