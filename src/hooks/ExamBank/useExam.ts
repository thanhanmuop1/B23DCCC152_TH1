import { useState, useCallback } from 'react';
import { message } from 'antd';
import {
  getExams,
  generateExam,
  deleteExam,
  getExamById,
  randomizeExamQuestions,
} from '@/services/ExamBank/Exam/exam';
import type { Exam, ExamRequest, ExamDetail } from '@/models/exam';

export default function useExam() {
  const [loading, setLoading] = useState(false);
  const [randomizing, setRandomizing] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentExam, setCurrentExam] = useState<ExamDetail | null>(null);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getExams();
      if (response.success) {
        setExams(response.data || []);
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi tải danh sách đề thi');
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      message.error('Không thể tải danh sách đề thi');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExamDetail = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const response = await getExamById(id);
      if (response.success) {
        setCurrentExam(response.data || null);
        return response.data;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi tải chi tiết đề thi');
        return null;
      }
    } catch (error) {
      console.error('Error fetching exam detail:', error);
      message.error('Không thể tải chi tiết đề thi');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createExam = useCallback(async (data: ExamRequest) => {
    try {
      setLoading(true);
      const response = await generateExam(data);
      if (response.success) {
        message.success('Tạo đề thi thành công');
        await fetchExams();
        return true;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi tạo đề thi');
        return false;
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      message.error('Không thể tạo đề thi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchExams]);

  const removeExam = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const response = await deleteExam(id);
      if (response.success) {
        message.success('Xóa đề thi thành công');
        await fetchExams();
        return true;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi xóa đề thi');
        return false;
      }
    } catch (error) {
      console.error('Error removing exam:', error);
      message.error('Không thể xóa đề thi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchExams]);

  // Thêm hàm randomize questions
  const randomizeQuestions = useCallback(async (id: number) => {
    try {
      setRandomizing(true);
      const response = await randomizeExamQuestions(id);
      if (response.success) {
        message.success('Random vị trí câu hỏi thành công');
        setCurrentExam(response.data || null);
        return response.data;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi random vị trí câu hỏi');
        return null;
      }
    } catch (error) {
      console.error('Error randomizing questions:', error);
      message.error('Không thể random vị trí câu hỏi');
      return null;
    } finally {
      setRandomizing(false);
    }
  }, []);

  return {
    loading,
    randomizing,
    exams,
    currentExam,
    fetchExams,
    fetchExamDetail,
    createExam,
    removeExam,
    randomizeQuestions,
  };
} 