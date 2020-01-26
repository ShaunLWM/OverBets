const express = require('express');

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 3001;

app.use(express.static("public"));
app.get("/", (req, res) => res.send("Hello World!"));

io.on("connection", (socket) => {
    console.log(`[+] socket connected: ${socket.id}`);
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
