const db = require('../configs/database');

class Question {
  static create(questionData) {
    return new Promise((resolve, reject) => {
      const { noi_dung, muc_do, mon_hoc_id, danh_muc_id } = questionData;
      
      const query = `
        INSERT INTO CauHoi (noi_dung, muc_do, mon_hoc_id, danh_muc_id)
        VALUES (?, ?, ?, ?)
      `;
      
      db.query(query, [noi_dung, muc_do, mon_hoc_id, danh_muc_id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve({
          id: results.insertId,
          ...questionData
        });
      });
    });
  }

  static async getById(id) {
      const query = `
        SELECT c.*, m.ma_mon, m.ten_mon, d.ten_danh_muc
        FROM CauHoi c
        JOIN MonHoc m ON c.mon_hoc_id = m.id
        JOIN DanhMucKhoiKienThuc d ON c.danh_muc_id = d.id
        WHERE c.id = ?
      `;
      const [rows] = await db.query(query, [id]);
      return rows[0] || null;
  }

  static async getAll() {
    const query = `
      SELECT 
          c.id,
          c.noi_dung,
          c.muc_do,
          c.mon_hoc_id,
          c.danh_muc_id,
          m.ma_mon,
          m.ten_mon,
          d.ten_danh_muc
        FROM CauHoi c
        JOIN MonHoc m ON c.mon_hoc_id = m.id
        JOIN DanhMucKhoiKienThuc d ON c.danh_muc_id = d.id
        ORDER BY c.id DESC
      `;
      const [rows] = await db.query(query);
      return rows;
  }
}

module.exports = Question; 