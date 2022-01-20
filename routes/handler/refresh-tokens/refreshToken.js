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

// api refresh token ini digunakan untuk merefresh access token yang sudah expired
// dengan men-decode / men-verify refresh token, lalu hasil decodenya kan terdapat
// data dari users (include email). decode.email dikomparasi dengan req.body.email
// jika tidak sama, akan ada return email not valid, jika sama maka akan dibuatkan 
// token baru dengan isi payload adalah informasi si usernya.

module.exports = async (req, res) => {
    try {
        if (!req.body.refresh_token || !req.body.email) {
            return res.status(400).json({
                status: false,
                message: "invalid token",
            });
        }

        await api.get('/refresh-tokens' , {params: {refresh_token: req.body.refresh_token}});

        jwt.verify(req.body.refresh_token, JWT_SECRET_REFRESH_TOKEN, (err , decoded) => {
            if (err) {
                return res.status(403).json({
                    status: false,
                    message: err.message
                })
            }

            if (req.body.email !== decoded.email) {
                return res.status(400).json({
                    status: false,
                    message: "email not valid"
                })
            }

            const newAccessToken = jwt.sign({decoded}, JWT_SECRET, {expiresIn: JWT_ACCESS_TOKEN_EXPIRED})
            return res.status(200).json({
                status: true,
                data: { token: newAccessToken }
            })
        })

    } catch (error) {
        
    }
}