const fetch = require("node-fetch");

module.exports = {
    async scrape(username) {
        const url = `https://playoverwatch.com/en-us/career/pc/${username.replace("#", "-")}`;
        const profilePage = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36" },
        });

        const profilePageData = await profilePage.text();
        const matches = /<img class="player-portrait" src="(.*?)">/g.exec(profilePageData);
        return matches !== null && matches.length > 0 ? matches[1] : "";
    },
    getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
