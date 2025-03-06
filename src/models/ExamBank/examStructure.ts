export interface ExamStructure {
    id: number;
    mon_hoc_id: number;
    muc_do: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
    danh_muc_id: number;
    so_luong: number;
    ten_mon?: string;
    ten_danh_muc?: string;
  }
  
  export interface ExamStructureResponse {
    mon_hoc_id: number;
    muc_do: string;
    danh_muc_id: number;
    so_luong: number;
  }
  
  export interface Exam {
    id: number;
    mon_hoc_id: number;
    ten_de: string;
    ngay_tao: string;
    ten_mon?: string;
    cau_hoi?: Question[];
  }
  
  export interface ExamResponse {
    mon_hoc_id: number;
    ten_de: string;
    cau_truc: ExamStructureResponse[];
  }
  
  export interface Question {
    id: number;
    noi_dung: string;
    muc_do: string;
    mon_hoc_id: number;
    danh_muc_id: number;
  }