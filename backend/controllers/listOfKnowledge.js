const ListOfKnowledge = require('../models/listOfKnowledge');

const listOfKnowledgeController = {
    // Lấy danh sách danh mục khối kiến thức
    getAllListOfKnowledge: async (req, res) => {
        try {
            const listOfKnowledge = await ListOfKnowledge.getAllListOfKnowledge();
            res.json(listOfKnowledge);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Thêm danh mục khối kiến thức mới
    createListOfKnowledge: async (req, res) => {
        try {
            const { ten_danh_muc } = req.body;
            const result = await ListOfKnowledge.createListOfKnowledge(ten_danh_muc);
            res.status(201).json({ message: 'Thêm danh mục khối kiến thức thành công', id: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Cập nhật danh mục khối kiến thức
    updateListOfKnowledge: async (req, res) => {
        try {
            const { id } = req.params;
            const { ten_danh_muc } = req.body;
            await ListOfKnowledge.updateListOfKnowledge(id, ten_danh_muc);
            res.json({ message: 'Cập nhật danh mục khối kiến thức thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Xóa danh mục khối kiến thức
    deleteListOfKnowledge: async (req, res) => {
        try {
            const { id } = req.params;
            await ListOfKnowledge.deleteListOfKnowledge(id);
            res.json({ message: 'Xóa danh mục khối kiến thức thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
};

module.exports = listOfKnowledgeController;
