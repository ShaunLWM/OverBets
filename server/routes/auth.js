const router = require("express").Router();
const passport = require("passport");

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies,
        });
    }
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
}));

// When logout, redirect to client
router.get("/logout", (req, res) => {
    req.logout();
    return res.redirect("/");
});

// auth with twitter
router.get("/bnet", passport.authenticate("bnet"));

// redirect to home page after successfully login via twitter
router.get("/bnet/callback", passport.authenticate("bnet", { failureRedirect: "/auth/login/failed" }),
    (req, res) => res.redirect("/"));

module.exports = router;
