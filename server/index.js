const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 3001;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
