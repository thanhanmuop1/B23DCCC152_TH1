import { ExamTemplate } from './examTemplate';

export interface ExamDetail {
  muc_do: string;
  so_luong: number;
  danh_muc_id?: number;
}

export interface ExamFormData {
  mon_hoc_id: string | number;
  ten_de: string;
  cau_truc?: ExamDetail[];
  template_id?: string | number;
}

/**
 * Xử lý dữ liệu form dựa trên tab đang active
 */
export const processExamFormData = (
  formValues: any,
  isFromTemplate: boolean,
  templates: ExamTemplate[]
): ExamFormData => {
  // Dữ liệu chung cho cả hai tab
  const result: ExamFormData = {
    mon_hoc_id: formValues.mon_hoc_id,
    ten_de: formValues.ten_de,
  };

  if (isFromTemplate) {
    // Xử lý dữ liệu từ tab "Tạo từ mẫu"
    if (!formValues.template_id) {
      throw new Error('Vui lòng chọn mẫu cấu trúc');
    }
    
    result.template_id = formValues.template_id;
    
    // Tìm template được chọn
    const selectedTemplate = templates.find(t => t.id === formValues.template_id);
    if (selectedTemplate) {
      // Chuyển đổi chi tiết template thành cấu trúc đề thi
      const cau_truc: ExamDetail[] = [];
      
      // Xử lý dựa trên loại cấu trúc (số lượng hoặc phần trăm)
      if (selectedTemplate.loai_cau_truc === 'so_luong') {
        // Nếu là template theo số lượng, sử dụng trực tiếp
        selectedTemplate.chi_tiet.forEach(detail => {
          cau_truc.push({
            muc_do: detail.muc_do,
            so_luong: detail.so_luong || 0,
            // Sử dụng danh_muc_id mặc định nếu cần
            danh_muc_id: formValues.danh_muc_id || 1
          });
        });
      } else if (selectedTemplate.loai_cau_truc === 'phan_tram') {
        // Nếu là template theo phần trăm, cần chuyển đổi thành số lượng
        // Sử dụng tổng số câu hỏi từ form hoặc mặc định là 100
        const totalQuestions = formValues.total_questions || 100;
        
        selectedTemplate.chi_tiet.forEach(detail => {
          const phanTram = detail.phan_tram || 0;
          cau_truc.push({
            muc_do: detail.muc_do,
            so_luong: Math.round((phanTram / 100) * totalQuestions),
            danh_muc_id: formValues.danh_muc_id || 1
          });
        });
      }
      
      result.cau_truc = cau_truc;
    }
  } else {
    // Xử lý dữ liệu từ tab "Tạo cấu trúc mới"
    if (!formValues.chi_tiet || formValues.chi_tiet.length === 0) {
      throw new Error('Vui lòng thêm ít nhất một mức độ');
    }
    
    // Chuyển đổi chi_tiet thành cau_truc
    result.cau_truc = formValues.chi_tiet.map((detail: any) => ({
      muc_do: detail.muc_do,
      so_luong: detail.so_luong,
      danh_muc_id: formValues.danh_muc_id || 1
    }));
  }

  return result;
};

/**
 * Kiểm tra xem form có hợp lệ không dựa trên tab đang active
 */
export const validateExamForm = async (
  form: any,
  isFromTemplate: boolean
): Promise<boolean> => {
  try {
    // Danh sách các trường cần validate dựa trên tab đang active
    const fieldsToValidate = ['mon_hoc_id', 'ten_de'];
    
    if (isFromTemplate) {
      fieldsToValidate.push('template_id');
    } else {
      fieldsToValidate.push('chi_tiet');
    }
    
    // Chỉ validate các trường cần thiết
    await form.validateFields(fieldsToValidate);
    return true;
  } catch (error) {
    return false;
  }
}; 