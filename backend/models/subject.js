const db = require('../configs/database');

class Subject {
    // Lấy danh sách tất cả môn học
    static async getAllSubjects() {
        const [rows] = await db.query('SELECT * FROM MonHoc');
        return rows;
    }

    // Thêm môn học mới
    static async createSubject(ma_mon, ten_mon, so_tin_chi) {
        const [result] = await db.query(
            'INSERT INTO MonHoc (ma_mon, ten_mon, so_tin_chi) VALUES (?, ?, ?)',
            [ma_mon, ten_mon, so_tin_chi]
        );
        return result;
    }

    // Cập nhật môn học
    static async updateSubject(id, ma_mon, ten_mon, so_tin_chi) {
        const [result] = await db.query(
            'UPDATE MonHoc SET ma_mon = ?, ten_mon = ?, so_tin_chi = ? WHERE id = ?',
            [ma_mon, ten_mon, so_tin_chi, id]
        );
        return result;
    }

    // Xóa môn học
    static async deleteSubject(id) {
        const [result] = await db.query('DELETE FROM MonHoc WHERE id = ?', [id]);
        return result;
    }
}

module.exports = Subject;
