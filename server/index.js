require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

require("./lib/Passport");
const database = require("./lib/Database");
const authRoutes = require("./routes/auth");
const isAuthenticated = require("./lib/isAuthenticated");
const { getRandomNumber, getRandomAvatar } = require("./lib/Helper");
const { calculateOdds } = require("./lib/Perimutuel");

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5000"], // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
}));

app.use(cookieParser());
app.use(cookieSession({
    name: "session",
    keys: [process.env.SERVER_COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.database = database;

app.use("/auth", authRoutes);

app.get("/", (req, res) => { // get all bets info aka homepage
    res.send("Hello World!");
});

app.get("/user", (req, res) => { // get user info

});

let matches = [];

async function populateMatches() {
    if (matches.length > 0) return;
    const matchesDb = await database.getMatches();
    matches = await Promise.all(matchesDb.map(async (match) => {
        const leftTeamTotal = await database.getSumBets(match.match_id, 0);
        const rightTeamTotal = await database.getSumBets(match.match_id, 1);
        const teamOdds = calculateOdds([leftTeamTotal, rightTeamTotal], 0, true);
        const users = (await database.getBets(match.match_id, 6)).reverse().map((u) => ({
            bet_amount: u.bet_amount,
            user_image: u.user_image,
            user_battletag: u.user_battletag,
        }));

        const teamOne = await database.getTeam(match.match_teamOneId);
        const teamTwo = await database.getTeam(match.match_teamTwoId);
        const matchPercentage = Number((leftTeamTotal / (leftTeamTotal + rightTeamTotal)) * 100);
        return {
            match: {
                ...match,
                match_percentage: Number(Math.round(matchPercentage)),
                teamOne: {
                    ...teamOne,
                    team_odds: teamOdds.payoutRatio[0],
                    team_total: leftTeamTotal,
                },
                teamTwo: {
                    ...teamTwo,
                    team_odds: teamOdds.payoutRatio[1],
                    team_total: rightTeamTotal,
                },
            },
            users,
        };
    }));
}

app.get("/profile", isAuthenticated, async (req, res) => {
    const { uid } = req.user;
    const profile = await database.getUserById(uid);
    return res.status(200).json({ success: true, profile });
});

app.get("/me/:tag", async (req, res) => {
    const tag = decodeURIComponent(req.params.tag);
    const history = await database.getUserBetsHistory(tag);
    return res.status(200).json({ success: true, history });
});

app.get("/matches", async (req, res) => res.status(200).json(matches));

app.get("/matches/:matchId", (req, res) => {
    const { matchId } = req.params;
    const m = matches.find((match) => match.match.match_id === parseInt(matchId, 10));
    if (typeof m === "undefined") return res.status(400).json({ success: false, msg: "Match not found" });
    return res.status(200).json({ success: true, match: m });
});

function emitNewBet({
    matchId, battletag, coins, img, odds, percentage,
}) {
    io.emit("match:bet:new:end", {
        match_id: matchId,
        user: {
            user_battletag: battletag,
            user_image: img,
            bet_amount: coins,
        },
        payout: {
            odds, percentage,
        },
    });
}

io.on("connection", (socket) => {
    console.log(`[+] socket connected: ${socket.id}`);

    socket.on("match:distribute", ({ matchId, token, winnerSide }) => {
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) return console.log("Failed to decode token");
            const { user_id: uid } = decoded;
            const user = await database.getUserById(uid);
            if (!user || user.user_rank !== 0) return;
            // TODO: Do some banning here
            const mid = Number(matchId);
            const match = await database.getMatch(mid);
            if (!match) return; // just to check match exist
            const bets = await database.getBets(mid, 0);
            const winnerGroup = bets.map(bet => bet.bet_side === winnerSide);
            const loserSide = winnerSide === 0 ? 1 : 0;
            const loserGroup = bets.map(bet => bet.bet_side === loserSide);
            console.log(winnerGroup);
            console.log(loserGroup);
            const winnerTotal = winnerGroup.reduce((acc, cur) => acc + cur.bet_amount);
            const loserTotal = loserGroup.reduce((acc, cur) => acc + cur.bet_amount);
            const teamOdds = (calculateOdds([winnerTotal, loserTotal], 0))[0];
            console.log(`Odds: ${teamOdds}`);
            if (isNaN(teamOdds) || teamOdds === Infinity) return console.log("[!] something wrong allocating teamodds");
            for (let i = 0; i < winnerGroup.length; i++) {
                const userId = winnerGroup[i].bet_userId;
                const amount = Math.floor(winnerGroup[i].bet_amount * teamOdds);
                if (isNaN(newAmount) || newAmount === Infinity) return;
                console.log(`[@] user ${userId} receiving ${amount} for this ${winnerGroup[i].bet_amount}/${teamOdds}x bet.`);
                await database.editCoins({ uid: userId, amount, add: true });
                await database.addTransaction({ type: "MATCH_REWARD", amount, data: mid });
            }

            await database.setMatchStatus(mid, "MATCH_ENDED");
            const matchIndex = matches.findIndex((m) => m.match.match_id === mid);
            matches[matchIndex].match.match_status = "MATCH_ENDED";
            socket.emit("match:distribute:end");
        });
    });

    socket.on("match:status:change", ({ matchId, status, token }) => {
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) return console.log("[match:status:change] Failed to decode token");
            const { user_id: uid } = decoded;
            const user = await database.getUserById(uid);
            console.log(user)
            if (!user || user.user_rank !== 0) return console.log("[match:status:change] user is not admin.");
            // TODO: Do some banning here
            const mid = Number(matchId);
            const match = await database.getMatch(mid);
            if (!match) return console.log("[match:status:change] match not found"); // just to check match exist
            if (match.match_status === status) return console.log("[match:status:change] same status");
            await database.setMatchStatus(mid, status);
            return socket.emit("match:status:change:end", { success: true });
        });
    })

    socket.on("match:bet:new", ({
        coins, token, side, matchId,
    }) => {
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) return console.log("Failed to decode token");
            const { user_id: uid } = decoded;
            const mid = Number(matchId);
            const teamSide = Number(side);
            const betCoins = Number(coins);
            if (isNaN(mid) || isNaN(teamSide) || isNaN(betCoins)) return socket.emit("match:bet:new:end", { success: false, msg: "Invalid input" });

            const user = await database.getUserById(uid);
            if (!user) return socket.emit("match:bet:new:end", { success: false, msg: "User not found. Contact admin." });
            if (user.user_coins < 1 || betCoins > user.user_coins) return socket.emit("match:bet:new:end", { success: false, msg: "Not enough coins" });
            // TODO: get match from database here?
            const matchData = matches.find((match) => match.match.match_id === mid);
            if (typeof matchData === "undefined") return socket.emit("match:bet:new:end", { success: false, msg: "Match doesn't exist" });
            if (matchData.match.match_status !== "MATCH_OPEN") return socket.emit("match:bet:new:end", { success: false, msg: "Match is not open for betting" });

            const matchTime = matchData.match.match_unix;
            const currentTime = Math.round(Date.now() / 1000);
            if ((currentTime + 5 * 60) >= matchTime) {
                await database.setMatchStatus(match.match.match_id, "MATCH_CLOSED");
                return socket.emit("match:bet:new:end", { success: false, msg: "Betting is closed for this match." });
            }

            const hasBetted = await database.checkBet({ uid, mid });
            if (hasBetted) return socket.emit("match:bet:new:end", { success: false, msg: "You have already bet for this game" });

            const addBet = await database.addBet({ uid, mid, coins: betCoins, side: teamSide });
            if (!addBet) return socket.emit("match:bet:new:end", { success: false, msg: "Unable to met. Please contact admin." });

            if (teamSide === 0) matchData.match.teamOne.team_total += betCoins;
            else matchData.match.teamTwo.team_total += betCoins;

            const leftTeamTotal = matchData.match.teamOne.team_total;
            const rightTeamTotal = matchData.match.teamTwo.team_total;
            const teamOdds = calculateOdds([leftTeamTotal, rightTeamTotal], 0, true);
            const matchPercentage = Math.round((leftTeamTotal / (leftTeamTotal + rightTeamTotal)) * 100);
            emitNewBet({
                battletag,
                img: user_image,
                coins: betCoins,
                matchId: mid,
                odds: [teamOdds.payoutRatio[0], teamOdds.payoutRatio[1]],
                percentage: matchPercentage,
            });

            if (matchData.users.length > 5) matchData.users.shift();
            matchData.users.push({
                user_image,
                bet_amount: betCoins,
                user_battletag: battletag,
            });

            database.editCoins({ uid, amount: betCoins });
            return database.addLogs({ type: 3, admin: 0, data: { msg: "User bet" } });
        });
    });
});

setInterval(() => {
    if (matches.length < 1) return;
    const randomMatch = getRandomNumber(0, matches.length - 1);
    const { match: { match_id: mid } } = matches[randomMatch];
    const battletag = `RandomGuy#${getRandomNumber(1, 9999)}`;
    const coins = getRandomNumber(1, 100);
    const img = getRandomAvatar();
    const randomSides = getRandomNumber(0, 1);
    if (randomSides === 0) matches[randomMatch].match.teamOne.team_total += coins;
    else matches[randomMatch].match.teamTwo.team_total += coins;

    const leftTeamTotal = matches[randomMatch].match.teamOne.team_total;
    const rightTeamTotal = matches[randomMatch].match.teamTwo.team_total;
    const teamOdds = calculateOdds([leftTeamTotal, rightTeamTotal], 0, true);
    const matchPercentage = Math.round((leftTeamTotal / (leftTeamTotal + rightTeamTotal)) * 100);
    emitNewBet({
        battletag,
        coins,
        img,
        matchId: mid,
        odds: [teamOdds.payoutRatio[0], teamOdds.payoutRatio[1]],
        percentage: matchPercentage,
    });
}, 1500);

server.listen(process.env.SERVER_PORT, async () => {
    console.log(`[#] overbets listening on port ${process.env.SERVER_PORT}!`);
    await populateMatches();
    console.log(matches);
    database.addLogs({ type: 4, data: { msg: `Server started ${new Date().toUTCString()}` } });
});
