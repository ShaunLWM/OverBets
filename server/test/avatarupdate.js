const database = require("../lib/Database");
const { getRandomNumber } = require("../lib/Helper");
(async () => {

    const avatars = (await database.getAvatars()).map(avatar => avatar.avatar_img);
    for (let playerId = 1; playerId < 108; playerId++) {
        await database.updateUserAvatar(playerId, avatars[Math.floor(Math.random() * avatars.length)]);
    }
})();
