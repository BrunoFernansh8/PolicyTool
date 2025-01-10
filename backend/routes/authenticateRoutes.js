const express = require('express');
const { loginUser, registerSuperUser, registerUser } = require('../controllers/authenticateController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register/superuser', registerSuperUser);
router.post('/register/user', registerUser);

module.exports = router;
