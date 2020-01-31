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
    origin: ["http://localhost:3001", "http://localhost:3000"], // allow to server to accept request from different origin
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
        const users = (await database.getBets(match.match_id)).map((u) => ({
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

app.get("/matches", async (req, res) => res.status(200).json(matches));

app.post("/profile", isAuthenticated, async (req, res) => {
    const { uid } = req.body;
    const profile = await database.getProfile(uid);
    return res.status(200).json({ success: true, profile });
});

app.get("/matches/:matchId", (req, res) => {
    const { matchId } = req.params;
    const m = matches.find((match) => match.match.match_id === parseInt(matchId, 10));
    if (typeof m === "undefined") return res.status(400).json({ success: false, msg: "Match not found" });
    return res.status(200).json({ success: true, match: m });
});

app.post("/matches/:matchId", isAuthenticated, async (req, res) => { // user betting on match
    // TODO: client side check as well
    const mid = req.params.matchId;
    const { coins, uid, side } = req.body;
    const canBet = await database.checkBet({ uid, mid });
    if (!canBet) return res.status(403).json({ success: false, msg: "You have already bet on this match." });
    const betUid = await database.addBet({
        uid, mid, coins, side,
    });

    return res.status(200).json({ success: true, betUid });
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

    socket.on("match:bet:new", ({
        coins, token, side, matchId,
    }) => {
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) return console.log("Failed to decode token");
            const { user_id: uid, user_battletag: battletag, user_image } = decoded;
            const mid = Number(matchId);
            const matchData = matches.find((match) => match.match_id === mid);
            if (typeof matchData === "undefined") return socket.emit("match:bet:new:end", { success: false, msg: "Match doesn't exist" });
            const hasBetted = await database.checkBet({ uid, mid });
            if (hasBetted) return socket.emit("match:bet:new:end", { success: false, msg: "You have already bet for this game" });
            const addBet = await database.addBet({
                uid, mid, coins, side,
            });

            if (!addBet) return socket.emit("match:bet:new:end", { success: false, msg: "Unable to met. Please contact admin." });
            emitNewBet({ battletag, coins, img: getRandomAvatar(), matchId: mid });
            if (matchData.users.length > 5) matchData.users.shift();
            matchData.users.push({
                user_image,
                bet_amount: coins,
                user_battletag: battletag,
            });

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
