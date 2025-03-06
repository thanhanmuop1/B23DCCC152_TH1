const express = require('express');
const router = express.Router();
const examTemplateStructureController = require('../controllers/examTemplateStructureController');

// Lấy tất cả cấu trúc đề thi mẫu
router.get('/', examTemplateStructureController.getAllTemplates);

// Tạo cấu trúc đề thi mẫu mới
router.post('/', examTemplateStructureController.createTemplate);

// Cập nhật cấu trúc đề thi mẫu
router.put('/:id', examTemplateStructureController.updateTemplate);

// Xóa cấu trúc đề thi mẫu
router.delete('/:id', examTemplateStructureController.deleteTemplate);

// Tính toán số lượng câu hỏi từ phần trăm
router.post('/calculate', examTemplateStructureController.calculateQuestionCounts);

module.exports = router; 