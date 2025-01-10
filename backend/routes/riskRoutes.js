const express = require('express');
const { getRisks, addRisk, analyzeConcern } = require('../controllers/riskController');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

const router = express.Router();

router.get('/', authenticateMiddleware, getRisks);
router.post('/', authenticateMiddleware, addRisk);
router.post('/analyze', authenticateMiddleware, analyzeConcern);

module.exports = router;
