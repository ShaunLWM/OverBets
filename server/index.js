require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

require("./lib/Passport");
const database = require("./lib/Database");
const authRoutes = require("./routes/auth");
const isAuthenticated = require("./lib/isAuthenticated");
const { getRandomNumber, getRandomAvatar } = require("./lib/Helper");

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

app.get("/matches", async (req, res) => {
    if (matches.length < 1) {
        const matchesDb = await database.getMatches();
        matches = await Promise.all(matchesDb.map(async (match) => {
            const users = (await database.getBets(match.match_id)).map((u) => ({ ...u }));
            const teamOne = await database.getTeam(match.match_teamOneId);
            const teamTwo = await database.getTeam(match.match_teamTwoId);
            return {
                ...match, teamOne, teamTwo, users,
            };
        }));
    }

    return res.status(200).json(matches);
});

app.get("/matches/:matchId", (req, res) => { // get bet info

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

io.on("connection", (socket) => {
    console.log(`[+] socket connected: ${socket.id}`);

    setInterval(() => {
        if (matches.length < 1) return;
        const randomMatch = getRandomNumber(0, matches.length - 1);
        const { match_id } = matches[randomMatch];
        socket.emit("match:bets:new", {
            match_id,
            user: {
                user_battletag: `RandomGuy#${getRandomNumber(1, 9999)}`,
                user_coins: getRandomNumber(0, 9999),
                user_image: getRandomAvatar(),
            },
        });
    }, 1000);
});

server.listen(process.env.SERVER_PORT, () => console.log(`Example app listening on port ${process.env.SERVER_PORT}!`));
