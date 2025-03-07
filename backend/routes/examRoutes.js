const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// Tạo đề thi theo cấu trúc
router.post('/generate', examController.createExamWithStructure);

// Lấy danh sách đề thi
router.get('/', examController.getAllExams);

// Lấy chi tiết đề thi
router.get('/:id', examController.getExamById);

// Xóa đề thi
router.delete('/:id', examController.deleteExam);

// New route for randomizing questions in an exam
router.post('/:id/randomize', examController.randomizeExamQuestions);

module.exports = router; 