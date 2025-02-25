const fetch = require("node-fetch");

const AVATAR = [
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/28/283df46ed213338f8e92b43d3dd2ac0f4bf8c24f_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/94/94eea09e79ba26c71116a14f59faf3c8720e0758_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/e6/e6b374c0cf19772b34757b3fe575b027f7bf2e91_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/d0/d0d56857dbe14dd28b43a5d368d4f9f7cf94ce79_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/61/61fa3127a3fdae40fef3671faa5082a528af7dbc_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c1/c1ea4c0e5093cbde7ef4b3a9abe709f0944f73cc_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/d9/d9f633e460d1b9317826e2ae6e8be6cdd070c09c_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/da/da02a1d4e4dbde046fc9d3146e37314e5cd94fae_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/f7/f78d92ca96435818699b3d50e0fcaf9b92caec7d_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fb/fbcff38d4b239f913690af8c228c52e1c874aefb_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fe5be29c3472c97a8625f9bc1216d9830c2c3d0f_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/e1/e11f4caf7cd22415a93f9945b9268dcc7933f754_full.jpg",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/80/80683e910ec2b00eb8903009b08a755e65d94349_full.jpg",
];

module.exports = {
    async getBattleImg(username) {
        const url = `https://playoverwatch.com/en-us/search/account-by-name/${encodeURIComponent(username)}`;
        const searchPage = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36" },
        });
        // {"name":"Nexus#12303","urlName":"Nexus-12303","id":376544439,"level":317,"playerLevel":317,"isPublic":false,"platform":"pc","portrait":"0x0250000000000AE6"}
        const results = await searchPage.json();
        return typeof results !== "undefined" && results !== null && results.length > 0 ? results[0] : null;
    },
    getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomAvatar() {
        return AVATAR[Math.floor(Math.random() * AVATAR.length)];
    },
};
