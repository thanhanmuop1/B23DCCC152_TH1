const db = require('../configs/database');

// Controller function to search questions by subject, difficulty level, and knowledge category
const searchQuestions = async (req, res) => {
    try {
        const { subjectId, difficultyLevel, knowledgeCategoryId } = req.query;
        console.log(subjectId, difficultyLevel, knowledgeCategoryId);
        // Start building the SQL query
        let query = `
            SELECT c.id, c.noi_dung, c.muc_do, m.ma_mon, m.ten_mon, d.ten_danh_muc
            FROM CauHoi c
            JOIN MonHoc m ON c.mon_hoc_id = m.id
            JOIN DanhMucKhoiKienThuc d ON c.danh_muc_id = d.id
            WHERE 1=1
        `;
        
        const params = [];
        
        // Add filters based on provided parameters
        if (subjectId) {
            query += ` AND m.ma_mon = ?`;
            params.push(subjectId);
        }
        
        if (difficultyLevel) {
            query += ` AND c.muc_do = ?`;
            params.push(difficultyLevel);
        }
        
        if (knowledgeCategoryId) {
            query += ` AND c.danh_muc_id = ?`;
            params.push(knowledgeCategoryId);
        }
        
        // Execute the query
        const [results] = await db.query(query, params);
        
        // Return the results
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        console.error('Error searching questions:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching questions',
            error: error.message
        });
    }
};

module.exports = {
    searchQuestions
}; 