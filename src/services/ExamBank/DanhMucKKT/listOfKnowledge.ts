import axios from '@/utils/axios';
import { ListOfKnowledge, ListOfKnowledgeResponse } from '@/models/ExamBank/listOfKnowledge';

const API_URL = 'http://localhost:3000/api';
export const listOfKnowledgeService = {
    getAll() {
        return axios.get<ListOfKnowledge[]>(`${API_URL}/listOfKnowledge`);
    },

    create(data: ListOfKnowledgeResponse) {
        return axios.post<ListOfKnowledge>(`${API_URL}/listOfKnowledge`, data);
    },

    update(id: number, data: ListOfKnowledgeResponse) {
        return axios.put<ListOfKnowledge>(`${API_URL}/listOfKnowledge/${id}`, data);
    },

    delete(id: number) {
        return axios.delete(`${API_URL}/listOfKnowledge/${id}`);
    }
};