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
  muc_do: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  danh_muc_id: number;
  ten_danh_muc: string;
}

export interface ExamDetail extends Exam {
  cau_hoi: ExamQuestion[];
}

export interface Exam {
  id: number;
  mon_hoc_id: number;
  ten_de: string;
  ngay_tao: string;
  ma_mon: string;
  ten_mon: string;
  so_cau_hoi: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}