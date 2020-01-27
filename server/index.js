require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const session = require('express-session');
const cors = require("cors");
const cookieParser = require("cookie-parser"); // parse cookie header

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

require("./lib/Passport");
const database = require("./lib/Database");
const authRoutes = require("./routes/auth");

app.use(cors({
    origin: "http://localhost:3001", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
}));

app.use(cookieParser());
app.use(cookieSession({
    name: "session",
    keys: [process.env.SERVER_COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
}));

app.use(session({
    secret: process.env.SERVER_SESSION_KEY,
    saveUninitialized: true,
    resave: true,
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

app.get("/matches/:matchId", (req, res) => { // get bet info

});

app.post("/matches/:matchId", (req, res) => { // user betting on match

});

io.on("connection", (socket) => {
    console.log(`[+] socket connected: ${socket.id}`);
});

server.listen(process.env.SERVER_PORT, () => console.log(`Example app listening on port ${process.env.SERVER_PORT}!`));
