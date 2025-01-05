const express = require('express');
const { createPolicy, downloadPolicy } = require('../controllers/policyController');
const authenticate = require('../middlewares/authenticateMiddleware');

const router = express.Router();

// Create a policy based on risks
router.post('/create', authenticate, createPolicy);

// Download the generated policy as a PDF
router.get('/download', authenticate, downloadPolicy);

module.exports = router;
