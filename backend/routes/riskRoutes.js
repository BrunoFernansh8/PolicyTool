const express = require('express');
const { getRisks, addRisk } = require('../controllers/riskController');
const authenticate = require('../middlewares/authenticateMiddleware');

const router = express.Router();

// Get all risks for the logged-in user
router.get('/', authenticate, getRisks);

// Add a new risk
router.post('/', authenticate, addRisk);

module.exports = router;
