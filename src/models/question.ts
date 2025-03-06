export interface Question {
  id: number;
  noi_dung: string;
  muc_do: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  mon_hoc_id: number;
  danh_muc_id: number;
  ma_mon?: string;
  ten_mon?: string;
  ten_danh_muc?: string;
}

export interface QuestionRequest {
  noi_dung: string;
  muc_do: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  mon_hoc_id: number;
  danh_muc_id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  current?: number;
  pageSize?: number;
}

export interface QuestionListResponse {
  data: Question[];
  total: number;
  success: boolean;
} 