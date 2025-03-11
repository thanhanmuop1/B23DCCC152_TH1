const ExamTemplateStructure = require('../models/examTemplateStructure');

// Lấy tất cả cấu trúc đề thi mẫu
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await ExamTemplateStructure.getAll();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách cấu trúc đề thi mẫu thành công',
      data: templates
    });
  } catch (error) {
    console.error('Error getting exam templates:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách cấu trúc đề thi mẫu',
      error: error.message
    });
  }
};

// Tạo cấu trúc đề thi mẫu mới
exports.createTemplate = async (req, res) => {
  try {
    const { ten_cau_truc, loai_cau_truc, chi_tiet, mon_hoc_id } = req.body;

    // Validate required fields
    if (!ten_cau_truc || !loai_cau_truc || !chi_tiet || !Array.isArray(chi_tiet) || chi_tiet.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin cấu trúc đề thi'
      });
    }

    // Validate loai_cau_truc
    if (!['so_luong', 'phan_tram'].includes(loai_cau_truc)) {
      return res.status(400).json({
        success: false,
        message: 'Loại cấu trúc không hợp lệ'
      });
    }

    // Validate chi tiết
    const validDifficulties = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
    for (const detail of chi_tiet) {
      if (!detail.muc_do || !validDifficulties.includes(detail.muc_do)) {
        return res.status(400).json({
          success: false,
          message: 'Mức độ không hợp lệ'
        });
      }

      if (loai_cau_truc === 'phan_tram') {
        if (!detail.phan_tram || detail.phan_tram <= 0 || detail.phan_tram > 100) {
          return res.status(400).json({
            success: false,
            message: 'Phần trăm phải lớn hơn 0 và nhỏ hơn hoặc bằng 100'
          });
        }
      } else {
        if (!detail.so_luong || detail.so_luong <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Số lượng câu hỏi phải lớn hơn 0'
          });
        }
      }
    }

    // Kiểm tra trùng lặp mức độ
    const difficulties = chi_tiet.map(item => item.muc_do);
    if (new Set(difficulties).size !== difficulties.length) {
      return res.status(400).json({
        success: false,
        message: 'Không được trùng lặp mức độ trong cấu trúc đề thi'
      });
    }

    // Kiểm tra tổng phần trăm nếu là loại phần trăm
    if (loai_cau_truc === 'phan_tram') {
      const totalPercentage = chi_tiet.reduce((sum, item) => sum + item.phan_tram, 0);
      if (totalPercentage !== 100) {
        return res.status(400).json({
          success: false,
          message: `Tổng phần trăm phải bằng 100%, hiện tại là ${totalPercentage}%`
        });
      }
    }

    const newTemplate = await ExamTemplateStructure.create({
      ten_cau_truc,
      loai_cau_truc,
      chi_tiet,
      mon_hoc_id
    });

    res.status(201).json({
      success: true,
      message: 'Tạo cấu trúc đề thi mẫu thành công',
      data: newTemplate
    });
  } catch (error) {
    console.error('Error creating exam template:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Tên cấu trúc đề thi đã tồn tại'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo cấu trúc đề thi mẫu',
      error: error.message
    });
  }
};

// Cập nhật cấu trúc đề thi mẫu
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_cau_truc, chi_tiet, mon_hoc_id } = req.body;

    // Validate required fields
    if (!ten_cau_truc || !chi_tiet || !Array.isArray(chi_tiet) || chi_tiet.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tên cấu trúc và chi tiết cấu trúc'
      });
    }

    // Validate chi tiết
    const validDifficulties = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
    for (const detail of chi_tiet) {
      if (!detail.muc_do || !validDifficulties.includes(detail.muc_do)) {
        return res.status(400).json({
          success: false,
          message: 'Mức độ không hợp lệ'
        });
      }
      if (!detail.phan_tram || detail.phan_tram <= 0 || detail.phan_tram > 100) {
        return res.status(400).json({
          success: false,
          message: 'Phần trăm phải lớn hơn 0 và nhỏ hơn hoặc bằng 100'
        });
      }
    }

    // Kiểm tra tổng phần trăm
    const totalPercentage = chi_tiet.reduce((sum, item) => sum + item.phan_tram, 0);
    if (totalPercentage !== 100) {
      return res.status(400).json({
        success: false,
        message: `Tổng phần trăm phải bằng 100%, hiện tại là ${totalPercentage}%`
      });
    }

    // Kiểm tra trùng lặp mức độ
    const difficulties = chi_tiet.map(item => item.muc_do);
    if (new Set(difficulties).size !== difficulties.length) {
      return res.status(400).json({
        success: false,
        message: 'Không được trùng lặp mức độ trong cấu trúc đề thi'
      });
    }

    const updatedTemplate = await ExamTemplateStructure.update(id, {
      ten_cau_truc,
      chi_tiet,
      mon_hoc_id
    });

    res.status(200).json({
      success: true,
      message: 'Cập nhật cấu trúc đề thi mẫu thành công',
      data: updatedTemplate
    });
  } catch (error) {
    console.error('Error updating exam template:', error);
    if (error.message === 'Không tìm thấy cấu trúc đề thi mẫu để cập nhật') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Tên cấu trúc đề thi đã tồn tại'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật cấu trúc đề thi mẫu',
      error: error.message
    });
  }
};

// Xóa cấu trúc đề thi mẫu
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await ExamTemplateStructure.delete(id);

    res.status(200).json({
      success: true,
      message: 'Xóa cấu trúc đề thi mẫu thành công'
    });
  } catch (error) {
    console.error('Error deleting exam template:', error);
    if (error.message === 'Không tìm thấy cấu trúc đề thi mẫu để xóa') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa cấu trúc đề thi mẫu',
      error: error.message
    });
  }
};

// Chuyển đổi cấu trúc đề thi theo phần trăm thành số lượng câu hỏi cụ thể
exports.calculateQuestionCounts = async (req, res) => {
  try {
    const { template_id, total_questions } = req.body;

    // Lấy cấu trúc đề thi
    const template = await ExamTemplateStructure.getById(template_id);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cấu trúc đề thi'
      });
    }

    // Nếu là loại phần trăm, yêu cầu total_questions
    if (template.loai_cau_truc === 'phan_tram' && (!total_questions || total_questions <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tổng số câu hỏi hợp lệ cho cấu trúc theo phần trăm'
      });
    }

    // Tính toán số lượng câu hỏi
    const questionCounts = ExamTemplateStructure.calculateQuestionCounts(
      template,
      total_questions
    );

    res.status(200).json({
      success: true,
      message: 'Tính toán số lượng câu hỏi thành công',
      data: {
        template_id,
        loai_cau_truc: template.loai_cau_truc,
        total_questions: template.loai_cau_truc === 'phan_tram' ? total_questions : 
          Object.values(questionCounts).reduce((sum, count) => sum + count, 0),
        question_counts: questionCounts
      }
    });
  } catch (error) {
    console.error('Error calculating question counts:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tính toán số lượng câu hỏi',
      error: error.message
    });
  }
}; 