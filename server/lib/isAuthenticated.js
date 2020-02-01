const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    if (!req.headers.authorization) return res.status(403).send({ msg: "Not logged in" });
    const bearerToken = req.headers.authorization;
    const token = (bearerToken.replace("Bearer ", "")).trim();
    return jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) return res.status(403).send({ success: false, msg: "corrupted token" });
        switch (req.method) {
            case "POST":
                req.body.uid = decoded.user_id;
                break;
            case "GET":
                req.user = { uid: decoded.user_id };
                break;
        }

        return next();
    });
}

module.exports = isAuthenticated;
