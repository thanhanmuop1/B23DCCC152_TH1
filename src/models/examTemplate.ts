export type DifficultyLevel = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
export type StructureType = 'so_luong' | 'phan_tram';

export interface ExamTemplateDetail {
  id?: number;
  muc_do: DifficultyLevel;
  so_luong?: number;
  phan_tram?: number;
}

export interface ExamTemplate {
  id: number;
  ten_cau_truc: string;
  loai_cau_truc: StructureType;
  chi_tiet: ExamTemplateDetail[];
}

export interface ExamTemplateRequest {
  ten_cau_truc: string;
  loai_cau_truc: StructureType;
  chi_tiet: ExamTemplateDetail[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
} 