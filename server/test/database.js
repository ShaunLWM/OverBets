const Database = require("../lib/Database");

(async () => {
    // await Database.connect();
    const matches = await Database.getMatches();
    for (const m of matches) {
        console.log('m :', m.match_id);
    }
})();
