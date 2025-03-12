const Exam = require('../models/exam');

// Tạo đề thi theo cấu trúc
exports.createExamWithStructure = async (req, res) => {
  try {
    const { mon_hoc_id, ten_de, cau_truc } = req.body;
    console.log(mon_hoc_id, ten_de, cau_truc);
    // Validate required fields
    if (!mon_hoc_id || !ten_de || !cau_truc || !Array.isArray(cau_truc) || cau_truc.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin đề thi và cấu trúc'
      });
    }
    
    // Validate cấu trúc
    for (const item of cau_truc) {
      const { muc_do, so_luong } = item;
      if (!muc_do || !so_luong) {
        return res.status(400).json({
          success: false,
          message: 'Cấu trúc đề thi không hợp lệ'
        });
      }

      const validDifficulties = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
      if (!validDifficulties.includes(muc_do)) {
        return res.status(400).json({
          success: false,
          message: `Mức độ "${muc_do}" không hợp lệ`
        });
      }

      if (so_luong <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng câu hỏi phải lớn hơn 0'
        });
      }
    }
    
    // Kiểm tra tính khả thi của cấu trúc
    try {
      console.log(mon_hoc_id, cau_truc);
      await Exam.validateStructure(mon_hoc_id, cau_truc);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    // Tạo đề thi
    const exam = await Exam.createWithStructure({
      mon_hoc_id,
      ten_de,
      cau_truc
    });

    res.status(201).json({
      success: true,
      message: 'Tạo đề thi thành công',
      data: exam
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo đề thi',
      error: error.message
    });
  }
};

// Lấy danh sách đề thi
exports.getAllExams = async (req, res) => {
  try {
    console.log('getAllExams');
    const exams = await Exam.getAll();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách đề thi thành công',
      data: exams
    });
  } catch (error) {
    console.error('Error getting exams:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách đề thi',
      error: error.message
    });
  }
};

// Lấy chi tiết đề thi
exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.getById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề thi'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy chi tiết đề thi thành công',
      data: exam
    });
  } catch (error) {
    console.error('Error getting exam:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy chi tiết đề thi',
      error: error.message
    });
  }
};

// Xóa đề thi
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    await Exam.delete(id);

    res.status(200).json({
      success: true,
      message: 'Xóa đề thi thành công'
    });
  } catch (error) {
    console.error('Error deleting exam:', error);
    if (error.message === 'Không tìm thấy đề thi để xóa') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa đề thi',
      error: error.message
    });
  }
};

// Controller function to randomize questions in an exam
exports.randomizeExamQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use the model method to randomize questions
    const examWithRandomizedQuestions = await Exam.randomizeQuestions(id);
    
    res.status(200).json({
      success: true,
      message: 'Đã random vị trí câu hỏi trong đề thi thành công',
      data: examWithRandomizedQuestions
    });
  } catch (error) {
    console.error('Error randomizing exam questions:', error);
    
    if (error.message === 'Không tìm thấy câu hỏi trong đề thi này') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi random vị trí câu hỏi',
      error: error.message
    });
  }
}; 