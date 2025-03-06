const db = require('../configs/database');

class ListOfKnowledge {
    // Lấy danh sách tất cả danh mục khối kiến thức
    static async getAllListOfKnowledge() {
        const [rows] = await db.query('SELECT * FROM DanhMucKhoiKienThuc');
        return rows;
    }

    // Thêm danh mục khối kiến thức mới
    static async createListOfKnowledge(ten_danh_muc) {
        const [result] = await db.query(
            'INSERT INTO DanhMucKhoiKienThuc (ten_danh_muc) VALUES (?)',
            [ten_danh_muc]
        );
        return result;
    }

    // Cập nhật danh mục khối kiến thức
    static async updateListOfKnowledge(id, ten_danh_muc) {
        const [result] = await db.query(
            'UPDATE DanhMucKhoiKienThuc SET ten_danh_muc = ? WHERE id = ?',
            [ten_danh_muc, id]
        );
        return result;
    }

    // Xóa danh mục khối kiến thức
    static async deleteListOfKnowledge(id) {
        const [result] = await db.query('DELETE FROM DanhMucKhoiKienThuc WHERE id = ?', [id]);
        return result;
    }
}

module.exports = ListOfKnowledge;
