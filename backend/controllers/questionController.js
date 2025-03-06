const Question = require('../models/Question');

// Controller for creating a new question
exports.createQuestion = async (req, res) => {
  try {
    const { noi_dung, muc_do, mon_hoc_id, danh_muc_id } = req.body;
    console.log(noi_dung, muc_do, mon_hoc_id, danh_muc_id);
    // Validate required fields
    if (!noi_dung || !muc_do || !mon_hoc_id || !danh_muc_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp đầy đủ thông tin câu hỏi' 
      });
    }
    
    // Validate muc_do (difficulty level)
    const validDifficulties = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
    if (!validDifficulties.includes(muc_do)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mức độ không hợp lệ. Mức độ phải là một trong: Dễ, Trung bình, Khó, Rất khó' 
      });
    }
    
    // Create the question
    const newQuestion = await Question.create({
      noi_dung,
      muc_do,
      mon_hoc_id,
      danh_muc_id
    });
    
    // Get the complete question data with subject and category information
    const questionWithDetails = await Question.getById(newQuestion.id);
    
    res.status(201).json({
      success: true,
      message: 'Tạo câu hỏi thành công',
      data: questionWithDetails
    });
    
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo câu hỏi',
      error: error.message
    });
  }
};

// Controller for getting all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.getAll();
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách câu hỏi thành công',
      data: questions
    });
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách câu hỏi',
      error: error.message
    });
  }
}; 