/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mysql = require("mysql2/promise");
const OverwatchLeague = require("overwatchleague.js");
const path = require("path");
require("dotenv").config();

const owl = new OverwatchLeague("en_US");
const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

(async () => {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
    });

    const schedule = await owl.getSchedule();
    require("fs").writeFileSync("./schedule.json", JSON.stringify(schedule.data, null, 2));
})();
