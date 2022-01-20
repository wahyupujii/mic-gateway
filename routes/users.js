const express = require('express');
const router = express.Router();

// verifyToken untuk bagian update
const verifyToken = require("../middleware/verifyToken");
const usersHandler = require("./handler/users")

router.post('/register', usersHandler.register);
router.post('/login', usersHandler.login);

// jika ingin mengupdate profile, user harus login (access token harus tersedia)
router.put('/', verifyToken, usersHandler.update);

router.get('/', verifyToken, usersHandler.getUser);

router.post('/logout', verifyToken, usersHandler.logout);

module.exports = router;
