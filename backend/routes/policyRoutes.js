const express = require('express');
const { createPolicy } = require('../controllers/policyController');
const { generatePolicy } = require('../controllers/policyController');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

const router = express.Router();

router.post('/policies', createPolicy)
router.post('/generate', authenticateMiddleware, generatePolicy);

module.exports = router;
