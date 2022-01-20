const {JWT_SECRET} = process.env
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization
    await jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: false,
                message: err.message
            })
        }
        req.user = decoded;
        return next()
    })
}