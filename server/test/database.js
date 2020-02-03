const database = require("../lib/Database");
const { getRandomNumber } = require("../lib/Helper");
(async () => {
    // const players = new Array(100).fill().map(() => {
    //     return {
    //         tag: `RandomGuy#${getRandomNumber(1, 9999)}`,
    //         img: `0x0250000000000AE6`
    //     }
    // })

    // console.log(players);
    // for (const player of players) {
    //     await database.addUser(player)
    // }

    const matches = await database.getMatches();
    for (let playerId = 8; playerId < 108; playerId++) {
        console.log(playerId);
        for (match of matches) {
            const uid = playerId;
            const mid = Number(match.match_id);
            const teamSide = Number(getRandomNumber(0, 1));
            const shouldBet = Number(getRandomNumber(0, 2));
            const betCoins = Number(getRandomNumber(1, 20));
            if (shouldBet === 0) { console.log("User is not betting.."); continue; }

            const user = await database.getUserById(uid);
            if (!user) { console.log("not user found"); continue; }
            if (user.user_coins < 1 || betCoins > user.user_coins) { console.log("not enough coins."); continue; }
            const hasBetted = await database.checkBet({ uid, mid });
            if (hasBetted) { console.log("already bet"); continue; }

            const addBet = await database.addBet({ uid, mid, coins: betCoins, side: teamSide });
            if (!addBet) { console.log("unable to bet."); continue; }

            database.editCoins({ uid, amount: betCoins });
            database.addLogs({ type: 3, admin: 0, data: { msg: "User bet" } });
        }
    }
})();
