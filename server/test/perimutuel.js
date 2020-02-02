const perimutuel = require("../lib/Perimutuel");

let pool = [2900, 2100];
console.log(perimutuel.calculateOdds(pool, 0, true));
