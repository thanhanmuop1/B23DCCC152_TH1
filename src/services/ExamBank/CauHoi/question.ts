import { request } from 'umi';
import type { Question, QuestionRequest, ApiResponse, QuestionListResponse } from '@/models/question';

const BASE_URL = 'http://localhost:3000/api/questions';

/**
 * Lấy danh sách câu hỏi
 */
export async function getQuestions(): Promise<ApiResponse<Question[]>> {
  return request(BASE_URL, {
    method: 'GET',
  });
}

/**
 * Tạo câu hỏi mới
 */
export async function createQuestion(data: QuestionRequest): Promise<ApiResponse<Question>> {
  return request(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  });
}

/**
 * Cập nhật câu hỏi
 */
export async function updateQuestion(id: number, data: QuestionRequest): Promise<ApiResponse<Question>> {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  });
}

/**
 * Xóa câu hỏi
 */
export async function deleteQuestion(id: number): Promise<ApiResponse<null>> {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Lấy chi tiết một câu hỏi
 */
export async function getQuestionById(id: number): Promise<ApiResponse<Question>> {
  return request(`${BASE_URL}/${id}`, {
    method: 'GET',
  });
} 