/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mysql = require("mysql2/promise");
const OverwatchLeague = require("overwatchleague.js");
const download = require("download");
const path = require("path");
require("dotenv").config();

const IMG_DEST = path.join(__dirname, "..", "public", "img");

const owl = new OverwatchLeague("en_US");
const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));
(async () => {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
    });

    const teams = (await owl.getTeams()).data;
    for (const team of teams.competitors) {
        console.log(`Team: ${team.competitor.id}`);
        await connection.query(
            "INSERT INTO `team`(`team_id`, `team_fullname`, `team_shortname`, `team_color`) VALUES(?, ?, ?, ?)",
            [team.competitor.id, team.competitor.name, team.competitor.abbreviatedName.toLowerCase(), team.competitor.primaryColor],
        );

        console.log(team.competitor.icon);
        await download(team.competitor.icon, path.join(IMG_DEST, "teams"), { filename: `${team.competitor.id}.svg` });
        await sleep();
    }

    const players = (await owl.getPlayers()).data;
    for (const player of players.data) {
        const { playerId } = player;
        console.log(playerId);
        const playerData = ((await owl.getPlayer(playerId)).data).data.player;
        const playerIgn = playerData.name;
        const playerCountry = playerData.nationality.toLowerCase();
        console.log(playerCountry);
        let playerRole = 0; // 0 - tank, 1 - dps, 2 = supp
        if (player.role === "offense") playerRole = 1;
        else if (player.role === "support") playerRole = 2;
        const playerTeamId = playerData.teams[0].team.id;
        const playerFullName = `${playerData.familyName} ${playerData.givenName}`;
        await connection.query(
            "INSERT INTO `player` (`player_id`, `player_ign`, `player_role`, `player_name`, `player_country`, `player_team_id`) VALUES (?,?,?,?,?,?);",
            [playerId, playerIgn, playerRole, playerFullName, playerCountry, playerTeamId],
        );

        await sleep();
        await download(playerData.headshot, path.join(IMG_DEST, "players"), { filename: `${playerId}.png` });
        await sleep();
    }
})();
