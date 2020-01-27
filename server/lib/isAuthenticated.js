function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect("/auth/bnet");
}

module.exports = checkAuthentication;
