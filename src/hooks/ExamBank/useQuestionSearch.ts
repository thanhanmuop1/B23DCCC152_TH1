import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import type { Question } from '@/models/ExamBank/question';
import { searchQuestions, SearchParams } from '@/services/ExamBank/search';
import { getSubjects, Subject } from '@/services/ExamBank/subject';
import { getKnowledgeCategories, KnowledgeCategory } from '@/services/ExamBank/knowledgeCategory';

export interface SearchState {
  loading: boolean;
  results: Question[];
  total: number;
  subjects: Subject[];
  categories: KnowledgeCategory[];
  isSearchActive: boolean;
}

export default function useQuestionSearch() {
  const [state, setState] = useState<SearchState>({
    loading: false,
    results: [],
    total: 0,
    subjects: [],
    categories: [],
    isSearchActive: false,
  });

  // Fetch subjects and knowledge categories
  const fetchFilterData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const [subjectsRes, categoriesRes] = await Promise.all([
        getSubjects(),
        getKnowledgeCategories(),
      ]);

      setState(prev => ({
        ...prev,
        subjects: subjectsRes.success ? subjectsRes.data : [],
        categories: categoriesRes.success ? categoriesRes.data : [],
      }));
    } catch (error) {
      message.error('Không thể tải dữ liệu bộ lọc');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);

  // Search questions
  const search = useCallback(async (params: SearchParams) => {
    const hasFilters = params.subjectId || params.difficultyLevel || params.knowledgeCategoryId;
    
    if (!hasFilters) {
      setState(prev => ({ ...prev, isSearchActive: false }));
      return;
    }
    
    setState(prev => ({ ...prev, loading: true, isSearchActive: true }));
    
    try {
      const response = await searchQuestions(params);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          results: response.data || [],
          total: response.count || 0,
        }));
      } else {
        message.error('Lỗi khi tìm kiếm câu hỏi');
        setState(prev => ({ ...prev, results: [], total: 0 }));
      }
    } catch (error) {
      message.error('Lỗi khi tìm kiếm câu hỏi');
      setState(prev => ({ ...prev, results: [], total: 0 }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Reset search
  const resetSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSearchActive: false,
      results: [],
      total: 0,
    }));
  }, []);

  return {
    ...state,
    fetchFilterData,
    search,
    resetSearch,
  };
} 