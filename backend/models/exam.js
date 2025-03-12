const db = require('../configs/database');

class Exam {
  static async createWithStructure(data) {
    const { mon_hoc_id, ten_de, cau_truc } = data;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Tạo đề thi mới
      const [examResult] = await connection.query(
        'INSERT INTO DeThi (mon_hoc_id, ten_de) VALUES (?, ?)',
        [mon_hoc_id, ten_de]
      );
      const deThiId = examResult.insertId;

      // 2. Lấy câu hỏi theo từng mức độ và danh mục
      for (const item of cau_truc) {
        const { muc_do, so_luong } = item;

        // Lấy câu hỏi ngẫu nhiên theo mức độ và danh mục
        const [questions] = await connection.query(
          `SELECT id FROM CauHoi 
           WHERE mon_hoc_id = ? AND muc_do = ? 
           ORDER BY RAND() LIMIT ?`,
          [mon_hoc_id, muc_do, so_luong]
        );

        // Kiểm tra số lượng câu hỏi có đủ không
        if (questions.length < so_luong) {
          throw new Error(
            `Không đủ câu hỏi cho mức độ "${muc_do}". ` +
            `Yêu cầu ${so_luong} câu, chỉ có ${questions.length} câu.`
          );
        }

        // Thêm câu hỏi vào đề thi
        for (const question of questions) {
          await connection.query(
            'INSERT INTO DeThi_CauHoi (de_thi_id, cau_hoi_id) VALUES (?, ?)',
            [deThiId, question.id]
          );
        }
      }

      await connection.commit();
      return this.getById(deThiId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    // Lấy thông tin đề thi
    const [exams] = await db.query(
      `SELECT d.*, m.ma_mon, m.ten_mon 
       FROM DeThi d
       JOIN MonHoc m ON d.mon_hoc_id = m.id
       WHERE d.id = ?`,
      [id]
    );

    if (exams.length === 0) {
      return null;
    }

    const exam = exams[0];

    // Lấy danh sách câu hỏi của đề thi
    const [questions] = await db.query(
      `SELECT c.*
       FROM DeThi_CauHoi dc
       JOIN CauHoi c ON dc.cau_hoi_id = c.id
       WHERE dc.de_thi_id = ?
       ORDER BY c.muc_do`,
      [id]
    );

    exam.cau_hoi = questions;
    return exam;
  }

  static async getAll() {
    const [exams] = await db.query(
      `SELECT d.*, m.ma_mon, m.ten_mon,
       (SELECT COUNT(*) FROM DeThi_CauHoi WHERE de_thi_id = d.id) as so_cau_hoi
       FROM DeThi d
       JOIN MonHoc m ON d.mon_hoc_id = m.id
       ORDER BY d.ngay_tao DESC`
    );

    return exams;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM DeThi WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error('Không tìm thấy đề thi để xóa');
    }
    return true;
  }

  // Kiểm tra tính khả thi của cấu trúc đề thi
  static async validateStructure(mon_hoc_id, cau_truc) {
    const connection = await db.getConnection();
    try {
      for (const item of cau_truc) {
        const { muc_do, so_luong } = item;

        // Đếm số câu hỏi có sẵn theo mức độ và danh mục
        const [result] = await connection.query(
          `SELECT COUNT(*) as count 
           FROM CauHoi 
           WHERE mon_hoc_id = ? AND muc_do = ?`,
          [mon_hoc_id, muc_do]
        );

        if (result[0].count < so_luong) {
          throw new Error(
            `Không đủ câu hỏi cho mức độ "${muc_do}". ` +
            `Yêu cầu ${so_luong} câu, hiện chỉ có ${result[0].count} câu.`
          );
        }
      }
      return true;
    } finally {
      connection.release();
    }
  }

  // Randomize questions in an exam
  static async randomizeQuestions(examId) {
    // Get all questions for this exam
    const [examQuestions] = await db.query(
      `SELECT de_thi_id, cau_hoi_id FROM DeThi_CauHoi WHERE de_thi_id = ?`,
      [examId]
    );
    
    if (examQuestions.length === 0) {
      throw new Error('Không tìm thấy câu hỏi trong đề thi này');
    }
    
    // Shuffle the questions using Fisher-Yates algorithm
    for (let i = examQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [examQuestions[i], examQuestions[j]] = [examQuestions[j], examQuestions[i]];
    }
    
    // Start a transaction
    await db.query('START TRANSACTION');
    
    try {
      // First, delete all existing questions from the exam
      await db.query(
        `DELETE FROM DeThi_CauHoi WHERE de_thi_id = ?`,
        [examId]
      );
      
      // Then, insert the shuffled questions back
      for (const question of examQuestions) {
        await db.query(
          `INSERT INTO DeThi_CauHoi (de_thi_id, cau_hoi_id) VALUES (?, ?)`,
          [examId, question.cau_hoi_id]
        );
      }
      
      // Commit the transaction
      await db.query('COMMIT');
      
      // Get the updated exam with questions
      return await this.getById(examId);
    } catch (error) {
      // Rollback in case of error
      await db.query('ROLLBACK');
      throw error;
    }
  }
}

module.exports = Exam; 