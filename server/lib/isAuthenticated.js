const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    if (!req.headers.authorization) return res.status(403).send({ msg: "Not logged in" });
    const bearerToken = req.headers.authorization;
    const token = (bearerToken.replace("Bearer ", "")).trim();
    return jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) return res.status(403).send({ success: false, msg: "corrupted token" });
        if (req.body) req.body.uid = decoded.user_id;
        return next();
    });
}

module.exports = isAuthenticated;
