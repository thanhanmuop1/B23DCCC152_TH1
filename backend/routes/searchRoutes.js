const express = require('express');
const router = express.Router();
const { searchQuestions } = require('../controllers/searchController');

// Route to search questions by subject, difficulty level, and knowledge category
router.get('/', searchQuestions);

module.exports = router; 