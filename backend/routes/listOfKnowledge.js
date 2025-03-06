const express = require('express');
const router = express.Router();
const listOfKnowledgeController = require('../controllers/listOfKnowledge');

// Routes cho danh mục khối kiến thức
router.get('/', listOfKnowledgeController.getAllListOfKnowledge);
router.post('/', listOfKnowledgeController.createListOfKnowledge);
router.put('/:id', listOfKnowledgeController.updateListOfKnowledge);
router.delete('/:id', listOfKnowledgeController.deleteListOfKnowledge);

module.exports = router;
