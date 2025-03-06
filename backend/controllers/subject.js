const Subject = require('../models/subject');

const subjectController = {
    // Lấy danh sách môn học
    getAllSubjects: async (req, res) => {
        try {
            const subjects = await Subject.getAllSubjects();
            res.json(subjects);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Thêm môn học mới
    createSubject: async (req, res) => {
        try {
            const { ma_mon, ten_mon, so_tin_chi } = req.body;
            const result = await Subject.createSubject(ma_mon, ten_mon, so_tin_chi);
            res.status(201).json({ message: 'Thêm môn học thành công', id: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Cập nhật môn học
    updateSubject: async (req, res) => {
        try {
            const { id } = req.params;
            const { ma_mon, ten_mon, so_tin_chi } = req.body;
            await Subject.updateSubject(id, ma_mon, ten_mon, so_tin_chi);
            res.json({ message: 'Cập nhật môn học thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Xóa môn học
    deleteSubject: async (req, res) => {
        try {
            const { id } = req.params;
            await Subject.deleteSubject(id);
            res.json({ message: 'Xóa môn học thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
};

module.exports = subjectController;
