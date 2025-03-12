import { ExamTemplate } from './examTemplate';

export const createExamRequestFromTemplate = (
  formValues: any,
  template: ExamTemplate,
  totalQuestions?: number
) => {
  return {
    mon_hoc_id: formValues.mon_hoc_id,
    ten_de: formValues.ten_de,
    template_id: template.id,
    cau_truc: template.chi_tiet.map(detail => {
      // Chuyển đổi từ template sang cấu trúc đề thi
      return {
        muc_do: detail.muc_do,
        so_luong: template.loai_cau_truc === 'so_luong'
          ? detail.so_luong
          : Math.round((detail.phan_tram || 0) / 100 * (totalQuestions || 100)),
        danh_muc_id: 1 // Mặc định hoặc lấy từ form
      };
    })
  };
}; 