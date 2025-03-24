const express = require('express');
const { getRisks, addRisk, analyzeStoredRiskById, deleteRisk } = require('../controllers/riskController');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

const router = express.Router();

router.get('/getrisk', authenticateMiddleware, getRisks);
router.post('/risks', authenticateMiddleware, addRisk);
router.post('/risks/analyze', authenticateMiddleware, analyzeStoredRiskById);
router.delete('/risks/:id', authenticateMiddleware, deleteRisk);


module.exports = router;
