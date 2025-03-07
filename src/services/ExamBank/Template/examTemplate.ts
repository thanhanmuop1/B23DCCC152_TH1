import { request } from 'umi';
import type { ExamTemplate, ExamTemplateRequest, ApiResponse } from '@/models/examTemplate';

const BASE_URL = 'http://localhost:3000/api/exam-templates';

/**
 * Lấy danh sách cấu trúc đề thi mẫu
 */
export async function getExamTemplates(): Promise<ApiResponse<ExamTemplate[]>> {
  return request(BASE_URL, {
    method: 'GET',
  });
}

/**
 * Tạo cấu trúc đề thi mẫu mới
 */
export async function createExamTemplate(data: ExamTemplateRequest): Promise<ApiResponse<ExamTemplate>> {
  return request(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  });
}

/**
 * Cập nhật cấu trúc đề thi mẫu
 */
export async function updateExamTemplate(id: number, data: ExamTemplateRequest): Promise<ApiResponse<ExamTemplate>> {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  });
}

/**
 * Xóa cấu trúc đề thi mẫu
 */
export async function deleteExamTemplate(id: number): Promise<ApiResponse<null>> {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
} 