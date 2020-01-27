const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    if (!req.headers.authorization) return res.status(403).send({ msg: "Not logged in" });
    const bearerToken = req.headers.authorization;
    const token = (bearerToken.replace("Bearer ", "")).trim();
    return jwt.verify(token, process.env.JWT_SECRET, (error) => {
        if (error) return res.status(403).send({ msg: "corrupted token" });
        return next();
    });
}

module.exports = isAuthenticated;
