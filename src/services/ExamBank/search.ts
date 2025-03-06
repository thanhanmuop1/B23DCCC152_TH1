import axios from 'axios';
import type { Question } from '@/models/ExamBank/question';

const API_URL = 'http://localhost:3000/api/search';

export interface SearchParams {
  subjectId?: string | number; // Mã môn học hoặc ID
  difficultyLevel?: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  knowledgeCategoryId?: number;
}

export interface SearchResponse {
  success: boolean;
  count: number;
  data: Question[];
}

export const searchService = {
  /**
   * Tìm kiếm câu hỏi theo môn học, mức độ khó và khối kiến thức
   * @param params Tham số tìm kiếm
   */
  search(params: SearchParams) {
    // Chuyển đổi tham số nếu cần
    const queryParams: any = {};
    
    if (params.subjectId) {
      queryParams.subjectId = params.subjectId;
    }
    
    if (params.difficultyLevel) {
      queryParams.difficultyLevel = params.difficultyLevel;
    }
    
    if (params.knowledgeCategoryId) {
      queryParams.knowledgeCategoryId = params.knowledgeCategoryId;
    }
    
    return axios.get<SearchResponse>(API_URL, { params: queryParams });
  }
}; 