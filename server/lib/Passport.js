const passport = require("passport");
const BnetStrategy = require("passport-bnet").Strategy;
const database = require("./Database");
const { getBattleImg } = require("./Helper");

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => done(null, user.user_battletag));

// deserialize the cookieUserId to user in the database
passport.deserializeUser(async (id, done) => {
    const user = await database.getUserByTag(id);
    if (!user) return done(new Error("Failed to deserialize an user"));
    // TODO: User has to logout here.
    return done(null, { ...user });
});

passport.use(new BnetStrategy({
    clientID: process.env.BLIZZARD_AUTH_CLIENT,
    clientSecret: process.env.BLIZZARD_AUTH_SECRET,
    callbackURL: "/auth/bnet/callback",
    scope: "openid",
}, async (accessToken, refreshToken, profile, done) => {
    let user = await database.getUserByTag(profile.battletag);
    if (!user) {
        const avatar = await getBattleImg(profile.battletag).portrait || "0x02500000000002F9";
        const img = await database.getAvatarUrl(avatar);
        await database.addUser({ tag: profile.battletag, img });
        user = await database.getUserByTag(profile.battletag);
    }

    return done(null, { ...user });
}));
