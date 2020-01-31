const Database = require("../lib/Database");

(async () => {
    // await Database.connect();
    // const matches = await Database.getMatches();
    // for (const m of matches) {
    //     console.log('m :', m.match_id);
    // }

    // console.log(await Database.getSumBets(6));
    const result = await Database.addBet({ uid: 1, mid: 1, coins: 22, side: 1 });
})();
