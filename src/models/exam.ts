import { ExamTemplate } from './ExamBank/examTemplate';
import { processExamFormData } from './ExamBank/examFormHandler';

export interface ExamStructureItem {
  muc_do: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  danh_muc_id: number;
  so_luong: number;
}

export interface ExamRequest {
  mon_hoc_id: number;
  ten_de: string;
  cau_truc: ExamStructureItem[];
}

export interface ExamQuestion {
  id: number;
  noi_dung: string;
  muc_do: string;
  ten_danh_muc: string;
  danh_muc_id: number;
}

export interface ExamDetail extends Exam {
  cau_hoi: ExamQuestion[];
}

export interface Exam {
  id: number;
  ten_de: string;
  mon_hoc_id: number;
  ma_mon: string;
  ten_mon: string;
  so_cau_hoi: number;
  ngay_tao: string;
  cau_hoi?: ExamQuestion[];
}

export interface ExamStructureDetail {
  muc_do: string;
  so_luong: number;
  danh_muc_id: number;
}

export interface CreateExamRequest {
  mon_hoc_id: number;
  ten_de: string;
  cau_truc: ExamStructureDetail[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Hàm tiện ích để nhóm câu hỏi theo mức độ
export const groupQuestionsByDifficulty = (questions: ExamQuestion[] = []): Record<string, ExamQuestion[]> => {
  return questions.reduce((acc, question) => {
    const { muc_do } = question;
    if (!acc[muc_do]) {
      acc[muc_do] = [];
    }
    acc[muc_do].push(question);
    return acc;
  }, {} as Record<string, ExamQuestion[]>);
};

// Hàm tiện ích để tính tổng số câu hỏi từ cấu trúc
export const calculateTotalQuestions = (structure: ExamStructureDetail[]): number => {
  return structure.reduce((sum, detail) => sum + detail.so_luong, 0);
};

// Hàm tiện ích để chuyển đổi từ template sang cấu trúc đề thi
export const convertTemplateToStructure = (
  templateDetails: any[], 
  monHocId: number, 
  danhMucId: number, 
  totalQuestions?: number
): ExamStructureDetail[] => {
  return templateDetails.map(detail => {
    let soLuong: number;
    
    if ('so_luong' in detail && detail.so_luong) {
      // Nếu là template theo số lượng
      soLuong = detail.so_luong;
    } else if ('phan_tram' in detail && detail.phan_tram && totalQuestions) {
      // Nếu là template theo phần trăm
      soLuong = Math.round((detail.phan_tram / 100) * totalQuestions);
    } else {
      soLuong = 0;
    }
    
    return {
      muc_do: detail.muc_do,
      so_luong: soLuong,
      danh_muc_id: danhMucId
    };
  });
};

// Hàm tiện ích để tạo request tạo đề thi
export const createExamRequestFromForm = (
  values: any,
  isFromTemplate: boolean,
  templates: ExamTemplate[]
): CreateExamRequest => {
  const formattedData = processExamFormData(values, isFromTemplate, templates);
  
  // Chuyển đổi sang định dạng API
  const result: CreateExamRequest = {
    mon_hoc_id: Number(formattedData.mon_hoc_id),
    ten_de: formattedData.ten_de,
    cau_truc: []
  };
  
  // Nếu có cấu trúc, sử dụng nó
  if (formattedData.cau_truc && formattedData.cau_truc.length > 0) {
    result.cau_truc = formattedData.cau_truc.map(item => ({
      muc_do: item.muc_do,
      so_luong: item.so_luong,
      danh_muc_id: item.danh_muc_id || 1
    }));
  }
  
  return result;
};