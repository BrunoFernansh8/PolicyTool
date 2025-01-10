const express = require('express');
const { generatePolicy } = require('../controllers/policyController');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

const router = express.Router();

router.post('/generate', authenticateMiddleware, generatePolicy);

module.exports = router;
