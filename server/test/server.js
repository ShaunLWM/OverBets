require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);


app.use(cors({
    origin: ["*"], // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
}));

// app.get("/", (req, res) => res.status(200).json({ success: true }));

app.get("/",
    (req, res, next) => {
        console.log(req.headers);
        if (!req.headers.authorization) return res.status(403).send({ msg: "Not logged in" });
        const bearerToken = req.headers.authorization;
        const token = (bearerToken.replace("Bearer ", "")).trim();
        console.log(token);
        req.token = token;
        return next();
    }, (req, res) => {
        console.log(`got it ${req.token}`)
        return res.status(200).json({ success: true });
    });

server.listen(process.env.SERVER_PORT, async () => {
    console.log(`[#] overbets listening on port ${process.env.SERVER_PORT}!`);
});
