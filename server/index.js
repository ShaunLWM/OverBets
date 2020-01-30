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
        return {
            ...match,
            users,
            teamOne: { ...teamOne, team_odds: teamOdds.payoutRatio[0] },
            teamTwo: { ...teamTwo, team_odds: teamOdds.payoutRatio[1] },
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
    const m = matches.find((match) => match.match_id === parseInt(matchId, 10));
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
    matchId, battletag, coins, img,
}) {
    io.emit("match:bet:new:end", {
        match_id: matchId,
        user: {
            user_battletag: battletag,
            user_image: img,
            bet_amount: coins,
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
            await database.addBet({
                uid, mid, coins, side,
            });

            emitNewBet({
                battletag, coins, img: getRandomAvatar(), matchId: mid,
            });

            if (matchData.users.length > 5) matchData.users.shift();
            matchData.users.push({
                user_image,
                bet_amount: coins,
                user_battletag: battletag,
            });
        });
    });
});

setInterval(() => {
    if (matches.length < 1) return;
    const randomMatch = getRandomNumber(0, matches.length - 1);
    const { match_id: mid } = matches[randomMatch];
    emitNewBet({
        matchId: mid, battletag: `RandomGuy#${getRandomNumber(1, 9999)}`, coins: getRandomNumber(0, 9999), img: getRandomAvatar(),
    });
}, 5000);

server.listen(process.env.SERVER_PORT, async () => {
    console.log(`Example app listening on port ${process.env.SERVER_PORT}!`);
    await populateMatches();
    console.log(matches)
    process.exit(0)
    console.log("Done populating matches.");
});
