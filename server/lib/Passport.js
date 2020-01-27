const passport = require("passport");
const BnetStrategy = require('passport-bnet').Strategy;
const database = require("./Database");
// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => done(null, user.id));

// deserialize the cookieUserId to user in the database
passport.deserializeUser(async (id, done) => {
    const user = await database.getUser(id);
    if (typeof user === "undefined") {
        return done(new Error("Failed to deserialize an user"));
    }

    return done(null, user);
});

passport.use(new BnetStrategy({
    clientID: process.env.BLIZZARD_AUTH_CLIENT,
    clientSecret: process.env.BLIZZARD_AUTH_SECRET,
    callbackURL: "/auth/bnet/redirect",
    region: "us",
}, async (accessToken, refreshToken, profile, done) => {
    console.log(JSON.stringify(profile, null, 2));
    return done(null, profile);
    // const currentUser = await User.findOne({
    //     twitterId: profile._json.id_str
    // });
    // // create new user if the database doesn't have this user
    // if (!currentUser) {
    //     const newUser = await new User({
    //         name: profile._json.name,
    //         screenName: profile._json.screen_name,
    //         twitterId: profile._json.id_str,
    //         profileImageUrl: profile._json.profile_image_url
    //     }).save();
    //     if (newUser) {
    //         done(null, newUser);
    //     }
    // }
    // done(null, currentUser);
}));
