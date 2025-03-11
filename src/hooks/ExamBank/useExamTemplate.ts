import { useState, useCallback } from 'react';
import { message } from 'antd';
import {
  getExamTemplates,
  createExamTemplate,
  updateExamTemplate,
  deleteExamTemplate,
} from '@/services/ExamBank/Template/examTemplate';
import type { ExamTemplate, ExamTemplateRequest } from '@/models/ExamBank/examTemplate';

export default function useExamTemplate() {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getExamTemplates();
      if (response.success) {
        setTemplates(response.data || []);
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi tải danh sách cấu trúc đề thi');
      }
    } catch (error) {
      message.error('Không thể tải danh sách cấu trúc đề thi');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTemplate = useCallback(async (data: ExamTemplateRequest) => {
    try {
      setLoading(true);
      const response = await createExamTemplate(data);
      if (response.success) {
        message.success('Thêm cấu trúc đề thi thành công');
        await fetchTemplates();
        return true;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi thêm cấu trúc đề thi');
        return false;
      }
    } catch (error) {
      message.error('Không thể thêm cấu trúc đề thi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTemplates]);

  const editTemplate = useCallback(async (id: number, data: ExamTemplateRequest) => {
    try {
      setLoading(true);
      const response = await updateExamTemplate(id, data);
      if (response.success) {
        message.success('Cập nhật cấu trúc đề thi thành công');
        await fetchTemplates();
        return true;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi cập nhật cấu trúc đề thi');
        return false;
      }
    } catch (error) {
      message.error('Không thể cập nhật cấu trúc đề thi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTemplates]);

  const removeTemplate = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const response = await deleteExamTemplate(id);
      if (response.success) {
        message.success('Xóa cấu trúc đề thi thành công');
        await fetchTemplates();
        return true;
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi xóa cấu trúc đề thi');
        return false;
      }
    } catch (error) {
      message.error('Không thể xóa cấu trúc đề thi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTemplates]);

  return {
    loading,
    templates,
    fetchTemplates,
    addTemplate,
    editTemplate,
    removeTemplate,
  };
} 