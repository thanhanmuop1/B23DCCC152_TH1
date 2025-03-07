import { request } from 'umi';
import type { Exam, ExamRequest, ApiResponse, ExamDetail } from '@/models/exam';

const BASE_URL = 'http://localhost:3000/api/exams';

/**
 * Lấy danh sách đề thi
 */
export async function getExams(): Promise<ApiResponse<Exam[]>> {
  return request(BASE_URL, {
    method: 'GET',
  });
}

/**
 * Tạo đề thi mới theo cấu trúc
 */
export async function generateExam(data: ExamRequest): Promise<ApiResponse<Exam>> {
  return request(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  });
}

/**
 * Lấy chi tiết đề thi
 */
export async function getExamById(id: number): Promise<ApiResponse<ExamDetail>> {
  return request(`${BASE_URL}/${id}`, {
    method: 'GET',
  });
}

/**
 * Xóa đề thi
 */
export async function deleteExam(id: number): Promise<ApiResponse<null>> {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Random vị trí câu hỏi trong đề thi
 */
export async function randomizeExamQuestions(id: number): Promise<ApiResponse<ExamDetail>> {
  return request(`${BASE_URL}/${id}/randomize`, {
    method: 'POST',
  });
}