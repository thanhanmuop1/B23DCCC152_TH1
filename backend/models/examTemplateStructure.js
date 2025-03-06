const db = require('../configs/database');

class ExamTemplateStructure {
  static async create(data) {
    const { ten_cau_truc, chi_tiet } = data;

    // Bắt đầu transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Tạo cấu trúc đề thi mẫu
      const [result] = await connection.query(
        'INSERT INTO CauTrucDeThiMau (ten_cau_truc) VALUES (?)',
        [ten_cau_truc]
      );
      const cau_truc_id = result.insertId;

      // Thêm chi tiết cấu trúc
      for (const detail of chi_tiet) {
        await connection.query(
          'INSERT INTO CauTrucDeThiMau_ChiTiet (cau_truc_de_thi_mau_id, muc_do, so_luong) VALUES (?, ?, ?)',
          [cau_truc_id, detail.muc_do, detail.so_luong]
        );
      }

      await connection.commit();
      return this.getById(cau_truc_id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAll() {
    const [structures] = await db.query(`
      SELECT * FROM CauTrucDeThiMau ORDER BY id DESC
    `);

    // Lấy chi tiết cho mỗi cấu trúc
    for (const structure of structures) {
      const [details] = await db.query(`
        SELECT id, muc_do, so_luong
        FROM CauTrucDeThiMau_ChiTiet
        WHERE cau_truc_de_thi_mau_id = ?
        ORDER BY id
      `, [structure.id]);
      structure.chi_tiet = details;
    }

    return structures;
  }

  static async getById(id) {
    const [structures] = await db.query(`
      SELECT * FROM CauTrucDeThiMau WHERE id = ?
    `, [id]);

    if (structures.length === 0) {
      return null;
    }

    const structure = structures[0];
    const [details] = await db.query(`
      SELECT id, muc_do, so_luong
      FROM CauTrucDeThiMau_ChiTiet
      WHERE cau_truc_de_thi_mau_id = ?
      ORDER BY id
    `, [id]);

    structure.chi_tiet = details;
    return structure;
  }

  static async update(id, data) {
    const { ten_cau_truc, chi_tiet } = data;

    // Bắt đầu transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Cập nhật tên cấu trúc
      const [result] = await connection.query(
        'UPDATE CauTrucDeThiMau SET ten_cau_truc = ? WHERE id = ?',
        [ten_cau_truc, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Không tìm thấy cấu trúc đề thi mẫu để cập nhật');
      }

      // Xóa chi tiết cũ
      await connection.query(
        'DELETE FROM CauTrucDeThiMau_ChiTiet WHERE cau_truc_de_thi_mau_id = ?',
        [id]
      );

      // Thêm chi tiết mới
      for (const detail of chi_tiet) {
        await connection.query(
          'INSERT INTO CauTrucDeThiMau_ChiTiet (cau_truc_de_thi_mau_id, muc_do, so_luong) VALUES (?, ?, ?)',
          [id, detail.muc_do, detail.so_luong]
        );
      }

      await connection.commit();
      return this.getById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM CauTrucDeThiMau WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Không tìm thấy cấu trúc đề thi mẫu để xóa');
    }

    return true;
  }
}

module.exports = ExamTemplateStructure; 