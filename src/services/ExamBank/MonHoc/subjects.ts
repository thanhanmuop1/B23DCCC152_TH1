import axios from 'axios';
import { Subject, SubjectResponse } from '@/models/ExamBank/subjects';

const API_URL = 'http://localhost:3000/api';

export const subjectService = {
  getAll() {
    return axios.get<Subject[]>(`${API_URL}/subjects`);
  },

  create(data: SubjectResponse) {
    return axios.post<Subject>(`${API_URL}/subjects`, data);
  },

  update(id: number, data: SubjectResponse) {
    return axios.put<Subject>(`${API_URL}/subjects/${id}`, data);
  },

  delete(id: number) {
    return axios.delete(`${API_URL}/subjects/${id}`);
  }
};