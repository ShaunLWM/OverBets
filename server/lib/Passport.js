const passport = require("passport");
const BnetStrategy = require("passport-bnet").Strategy;
const database = require("./Database");

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => done(null, user.user_battletag));

// deserialize the cookieUserId to user in the database
passport.deserializeUser(async (id, done) => {
    const user = await database.getUser(id);
    if (!user) return done(new Error("Failed to deserialize an user"));
    // TODO: User has to logout here.
    return done(null, { ...user });
});

passport.use(new BnetStrategy({
    clientID: process.env.BLIZZARD_AUTH_CLIENT,
    clientSecret: process.env.BLIZZARD_AUTH_SECRET,
    callbackURL: "/auth/bnet/callback",
    region: "us",
    scope: "openid",
}, async (accessToken, refreshToken, profile, done) => {
    let user = await database.getUser(profile.battletag);
    if (!user) {
        await database.addUser(profile.battletag);
        user = await database.getUser(profile.battletag);
    }

    return done(null, { ...user });
}));
