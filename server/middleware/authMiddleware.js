const jwt = require("jsonwebtoken");
module.exports = function(req, res, next) {
    try {


        /* const token = localStorage.getItem('AuthToken');

        console.log("tokentokentokentoken", token) */

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Access Denied. No token provided.",
            });
        }
            
        const decoded = jwt.verify(token, process.env.jwt_secret);
        if (decoded.userId) {
            req.body.userIdFromToken = decoded.userId;
            next();
        } else {
            return res.status(400).send({
                success: false,
                message: "Invalid token",
            });
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};