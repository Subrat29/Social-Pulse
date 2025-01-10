const express = require('express');
const router = express.Router();
const { runFlow } = require('../controllers/flowController');

// POST /api/run-flow
router.post('/run-flow', runFlow);

module.exports = router;
