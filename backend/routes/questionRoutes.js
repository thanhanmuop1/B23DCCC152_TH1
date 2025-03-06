const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Route for getting all questions
router.get('/', questionController.getAllQuestions);

// Route for creating a new question
router.post('/', questionController.createQuestion);

// Route for updating a question
router.put('/:id', questionController.updateQuestion);

// Route for deleting a question
router.delete('/:id', questionController.deleteQuestion);

module.exports = router; 