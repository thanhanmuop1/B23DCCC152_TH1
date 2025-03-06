const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Route for getting all questions
router.get('/', questionController.getAllQuestions);

// Route for creating a new question
router.post('/', questionController.createQuestion);

module.exports = router; 