const express = require('express');
const router = express.Router();
const { getRisks, addRisk, analyzeConcern } = require('../controllers/riskController');
const authenticate = require('../middlewares/authenticateMiddleware');

// Get all risks for the logged-in user
router.get('/', authenticate, getRisks);
// Add a new risk
router.post('/', authenticate, addRisk);
//Analyse the risk
router.post('/analyze', authenticateMiddleware, analyzeConcern); 

module.exports = router;
