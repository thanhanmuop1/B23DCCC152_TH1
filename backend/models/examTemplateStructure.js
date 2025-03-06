const db = require('../configs/database');

class ExamTemplateStructure {
  static async create(data) {
    const { ten_cau_truc, loai_cau_truc, chi_tiet } = data;

    // Validate based on type
    if (loai_cau_truc === 'phan_tram') {
      const totalPercentage = chi_tiet.reduce((sum, item) => sum + (item.phan_tram || 0), 0);
      if (totalPercentage !== 100) {
        throw new Error('Tổng phần trăm phải bằng 100%');
      }
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Tạo cấu trúc đề thi mẫu
      const [result] = await connection.query(
        'INSERT INTO CauTrucDeThiMau (ten_cau_truc, loai_cau_truc) VALUES (?, ?)',
        [ten_cau_truc, loai_cau_truc]
      );
      const cau_truc_id = result.insertId;

      // Thêm chi tiết cấu trúc
      for (const detail of chi_tiet) {
        if (loai_cau_truc === 'phan_tram') {
          await connection.query(
            'INSERT INTO CauTrucDeThiMau_ChiTiet (cau_truc_de_thi_mau_id, muc_do, phan_tram) VALUES (?, ?, ?)',
            [cau_truc_id, detail.muc_do, detail.phan_tram]
          );
        } else {
          await connection.query(
            'INSERT INTO CauTrucDeThiMau_ChiTiet (cau_truc_de_thi_mau_id, muc_do, so_luong) VALUES (?, ?, ?)',
            [cau_truc_id, detail.muc_do, detail.so_luong]
          );
        }
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
        SELECT id, muc_do, so_luong, phan_tram
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
      SELECT id, muc_do, so_luong, phan_tram
      FROM CauTrucDeThiMau_ChiTiet
      WHERE cau_truc_de_thi_mau_id = ?
      ORDER BY id
    `, [id]);

    structure.chi_tiet = details;
    return structure;
  }

  static async update(id, data) {
    const { ten_cau_truc, loai_cau_truc, chi_tiet } = data;

    // Validate based on type
    if (loai_cau_truc === 'phan_tram') {
      const totalPercentage = chi_tiet.reduce((sum, item) => sum + (item.phan_tram || 0), 0);
      if (totalPercentage !== 100) {
        throw new Error('Tổng phần trăm phải bằng 100%');
      }
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Cập nhật tên và loại cấu trúc
      const [result] = await connection.query(
        'UPDATE CauTrucDeThiMau SET ten_cau_truc = ?, loai_cau_truc = ? WHERE id = ?',
        [ten_cau_truc, loai_cau_truc, id]
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
        if (loai_cau_truc === 'phan_tram') {
          await connection.query(
            'INSERT INTO CauTrucDeThiMau_ChiTiet (cau_truc_de_thi_mau_id, muc_do, phan_tram) VALUES (?, ?, ?)',
            [id, detail.muc_do, detail.phan_tram]
          );
        } else {
          await connection.query(
            'INSERT INTO CauTrucDeThiMau_ChiTiet (cau_truc_de_thi_mau_id, muc_do, so_luong) VALUES (?, ?, ?)',
            [id, detail.muc_do, detail.so_luong]
          );
        }
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

  // Chuyển đổi cấu trúc thành số lượng câu hỏi cụ thể
  static calculateQuestionCounts(template, totalQuestions = null) {
    const { loai_cau_truc, chi_tiet } = template;
    const counts = {};

    if (loai_cau_truc === 'so_luong') {
      // Nếu là loại số lượng, sử dụng trực tiếp
      for (const detail of chi_tiet) {
        counts[detail.muc_do] = detail.so_luong;
      }
    } else {
      // Nếu là loại phần trăm, tính toán số lượng
      if (!totalQuestions) {
        throw new Error('Cần cung cấp tổng số câu hỏi cho cấu trúc theo phần trăm');
      }

      let remainingQuestions = totalQuestions;
      const sortedDetails = [...chi_tiet].sort((a, b) => b.phan_tram - a.phan_tram);

      for (let i = 0; i < sortedDetails.length; i++) {
        const { muc_do, phan_tram } = sortedDetails[i];
        if (i === sortedDetails.length - 1) {
          counts[muc_do] = remainingQuestions;
        } else {
          const count = Math.round((phan_tram / 100) * totalQuestions);
          counts[muc_do] = count;
          remainingQuestions -= count;
        }
      }
    }

    return counts;
  }
}

module.exports = ExamTemplateStructure; 