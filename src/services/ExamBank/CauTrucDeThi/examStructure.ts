import axios from 'axios';
import { ExamStructure, ExamStructureResponse, Exam, ExamResponse } from '@/models/ExamBank/examStructure';

const API_URL = 'http://localhost:3000/api';

export const examService = {
  // Lấy danh sách cấu trúc đề thi
  getAllStructures() {
    return axios.get<ExamStructure[]>(`${API_URL}/exam-structures`);
  },

  // Tạo cấu trúc đề thi mới
  createStructure(data: ExamStructureResponse) {
    return axios.post<ExamStructure>(`${API_URL}/exam-structures`, data);
  },

  // Cập nhật cấu trúc đề thi
  updateStructure(id: number, data: ExamStructureResponse) {
    return axios.put<ExamStructure>(`${API_URL}/exam-structures/${id}`, data);
  },

  // Xóa cấu trúc đề thi
  deleteStructure(id: number) {
    return axios.delete(`${API_URL}/exam-structures/${id}`);
  },

  // Lấy danh sách đề thi
  getAllExams() {
    return axios.get<Exam[]>(`${API_URL}/exams`);
  },

  // Tạo đề thi mới
  createExam(data: ExamResponse) {
    return axios.post<Exam>(`${API_URL}/exams`, data);
  },

  // Lấy chi tiết đề thi
  getExamDetail(id: number) {
    return axios.get<Exam>(`${API_URL}/exams/${id}`);
  },

  // Xóa đề thi
  deleteExam(id: number) {
    return axios.delete(`${API_URL}/exams/${id}`);
  }
};