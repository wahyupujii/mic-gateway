const apiAdapter = require('../../apiAdapter');
const {
    URL_SERVICE_USER,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_REFRESH_TOKEN_EXPIRED
} = process.env
const jwt = require("jsonwebtoken")

const api = apiAdapter(URL_SERVICE_USER)

module.exports = async (req , res) => {
    try {
        const user = await api.post("/users/login", req.body);
        // console.log(user.data.data)

        // token akan disimpan sebagai access token ke semua endpoint api
        // refresh_token akan disimpan di db
        const token = jwt.sign(user.data.data, JWT_SECRET, {expiresIn: JWT_ACCESS_TOKEN_EXPIRED});
        const refresh_token = jwt.sign(user.data.data, JWT_SECRET_REFRESH_TOKEN, {expiresIn: JWT_REFRESH_TOKEN_EXPIRED});

        await api.post("/refresh-tokens", {refresh_token , user_id: user.data.data.id})

        return res.json({
            status: true,
            data: {
                token, refresh_token
            }
        })
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ status: false, message: "service unavailable"})
        }

        const {status, data} = error.response;
        return res.status(status).json(data);
    }
}