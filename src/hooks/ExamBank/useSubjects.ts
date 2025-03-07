import { useState } from 'react';
import { Subject, SubjectResponse } from '@/models/ExamBank/subjects';
import { subjectService } from '@/services/ExamBank/MonHoc/subjects';
import { message } from 'antd';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectService.getAll();
      setSubjects(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (values: SubjectResponse) => {
    try {
      await subjectService.create(values);
      message.success('Thêm môn học thành công');
      await fetchSubjects();
      return true;
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm môn học');
      return false;
    }
  };

  const updateSubject = async (id: number, values: SubjectResponse) => {
    try {
      await subjectService.update(id, values);
      message.success('Cập nhật môn học thành công');
      await fetchSubjects();
      return true;
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật môn học');
      return false;
    }
  };

  const deleteSubject = async (id: number) => {
    try {
      await subjectService.delete(id);
      message.success('Xóa môn học thành công');
      await fetchSubjects();
      return true;
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa môn học');
      return false;
    }
  };

  return {
    subjects,
    loading,
    editingSubject,
    setEditingSubject,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
}; 