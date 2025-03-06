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
    const { ten_cau_truc, chi_tiet } = req.body;

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
      if (!detail.so_luong || detail.so_luong <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng câu hỏi phải lớn hơn 0'
        });
      }
    }

    const newTemplate = await ExamTemplateStructure.create({
      ten_cau_truc,
      chi_tiet
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
    const { ten_cau_truc, chi_tiet } = req.body;

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
      if (!detail.so_luong || detail.so_luong <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng câu hỏi phải lớn hơn 0'
        });
      }
    }

    const updatedTemplate = await ExamTemplateStructure.update(id, {
      ten_cau_truc,
      chi_tiet
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