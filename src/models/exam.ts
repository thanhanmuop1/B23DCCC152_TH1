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
  formValues: any, 
  isFromTemplate: boolean, 
  templates: any[]
): CreateExamRequest => {
  if (isFromTemplate) {
    const selectedTemplate = templates.find(t => t.id === formValues.template_id);
    if (!selectedTemplate) {
      throw new Error('Template không tồn tại');
    }
    
    return {
      mon_hoc_id: formValues.mon_hoc_id,
      ten_de: formValues.ten_de,
      cau_truc: convertTemplateToStructure(
        selectedTemplate.chi_tiet,
        formValues.mon_hoc_id,
        formValues.danh_muc_id,
        formValues.total_questions
      )
    };
  } else {
    return {
      mon_hoc_id: formValues.mon_hoc_id,
      ten_de: formValues.ten_de,
      cau_truc: formValues.chi_tiet.map((detail: any) => ({
        muc_do: detail.muc_do,
        so_luong: detail.so_luong,
        danh_muc_id: formValues.danh_muc_id
      }))
    };
  }
};