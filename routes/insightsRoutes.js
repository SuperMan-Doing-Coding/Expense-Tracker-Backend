const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getSpendingInsights } = require('../controllers/insightsController');
const router = express.Router();

router.get('/', protect, getSpendingInsights);

module.exports = router;