import axios from '@/utils/axios';
import { ListOfKnowledge, ListOfKnowledgeResponse } from '@/models/listOfKnowledge';

const API_URL = 'http://localhost:3000/api/listOfKnowledge';
export const listOfKnowledgeService = {
    getAll() {
        return axios.get<ListOfKnowledge[]>(`${API_URL}`);
    },

    create(data: ListOfKnowledgeResponse) {
        return axios.post<ListOfKnowledge>(`${API_URL}`, data);
    },

    update(id: number, data: ListOfKnowledgeResponse) {
        return axios.put<ListOfKnowledge>(`${API_URL}/${id}`, data);
    },

    delete(id: number) {
        return axios.delete(`${API_URL}/${id}`);
    }
};