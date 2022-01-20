const apiAdapter = require('../../apiAdapter');
const {URL_SERVICE_USER} = process.env

const api = apiAdapter(URL_SERVICE_USER)

module.exports = async (req , res) => {
    try {
        // return res.json(req.user)

        // req.user diambil dari decode di file middleware verifyToken
        const user = await api.put(`/users/${req.user.id}`, req.body);

        return res.json(user.data)
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ status: false, message: "service unavailable"})
        }

        const {status, data} = error.response;
        return res.status(status).json(data);
    }
}