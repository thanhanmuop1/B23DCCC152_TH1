import { useState, useCallback } from 'react';
import { message } from 'antd';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
} from '@/services/ExamBank/CauHoi/question';
import type { Question, QuestionRequest } from '@/models/question';

export default function useQuestion() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getQuestions();
      if (response.success) {
        setQuestions(response.data || []);
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi tải danh sách câu hỏi');
      }
    } catch (error) {
      message.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  }, []);

  const addQuestion = useCallback(async (data: QuestionRequest) => {
    try {
      setLoading(true);
      const response = await createQuestion(data);
      if (response.success) {
        message.success('Thêm câu hỏi thành công');
        await fetchQuestions();
        return true;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi thêm câu hỏi');
        return false;
      }
    } catch (error) {
      message.error('Không thể thêm câu hỏi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchQuestions]);

  const editQuestion = useCallback(async (id: number, data: QuestionRequest) => {
    try {
      setLoading(true);
      const response = await updateQuestion(id, data);
      if (response.success) {
        message.success('Cập nhật câu hỏi thành công');
        await fetchQuestions();
        return true;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi cập nhật câu hỏi');
        return false;
      }
    } catch (error) {
      message.error('Không thể cập nhật câu hỏi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchQuestions]);

  const removeQuestion = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const response = await deleteQuestion(id);
      if (response.success) {
        message.success('Xóa câu hỏi thành công');
        await fetchQuestions();
        return true;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi xóa câu hỏi');
        return false;
      }
    } catch (error) {
      message.error('Không thể xóa câu hỏi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchQuestions]);

  const fetchQuestionDetail = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const response = await getQuestionById(id);
      if (response.success) {
        setCurrentQuestion(response.data || null);
        return response.data;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi tải chi tiết câu hỏi');
        return null;
      }
    } catch (error) {
      message.error('Không thể tải chi tiết câu hỏi');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    questions,
    currentQuestion,
    fetchQuestions,
    addQuestion,
    editQuestion,
    removeQuestion,
    fetchQuestionDetail,
  };
} 