const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const database = require("../lib/Database");
const isAuthenticated = require("../lib/isAuthenticated");

router.get("/login", async (req, res) => {
    if (!req.user) return res.status(401).json({ success: false });
    const user = await database.getUser(req.user.user_battletag);
    const token = await jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: 36000 });
    return res.json({
        success: true,
        token,
    });
});

router.get("/check", isAuthenticated, (req, res) => {
    return res.json({ success: true });
});

router.get("/login/failed", (req, res) => res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
}));

router.get("/logout", (req, res) => {
    req.logout();
    return res.redirect("/");
});

router.get("/bnet", passport.authenticate("bnet"));

router.get("/bnet/callback", passport.authenticate("bnet", { failureRedirect: "/auth/login/failed" }),
    (req, res) => res.redirect("/auth/login"));

module.exports = router;
