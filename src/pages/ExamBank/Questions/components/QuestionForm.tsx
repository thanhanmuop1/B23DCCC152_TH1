import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { Question, QuestionRequest } from '@/models/question';

const { TextArea } = Input;
const { Option } = Select;

interface QuestionFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: QuestionRequest) => void;
  initialValues?: Question | null;
}

const difficultyLevels = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const QuestionForm: React.FC<QuestionFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        noi_dung: initialValues.noi_dung,
        muc_do: initialValues.muc_do,
        mon_hoc_id: initialValues.mon_hoc_id,
        danh_muc_id: initialValues.danh_muc_id,
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData: QuestionRequest = {
        noi_dung: values.noi_dung.trim(),
        muc_do: values.muc_do,
        mon_hoc_id: Number(values.mon_hoc_id),
        danh_muc_id: Number(values.danh_muc_id),
      };
      onSubmit(formData);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="noi_dung"
          label="Nội dung câu hỏi"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
        >
          <TextArea rows={4} placeholder="Nhập nội dung câu hỏi" />
        </Form.Item>

        <Form.Item
          name="muc_do"
          label="Mức độ"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
        >
          <Select placeholder="Chọn mức độ">
            {difficultyLevels.map(level => (
              <Option key={level} value={level}>
                {level}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="mon_hoc_id"
          label="Môn học"
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select placeholder="Chọn môn học">
            <Option value={1}>Khoa học máy tính cơ bản</Option>
            <Option value={2}>Toán rời rạc</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="danh_muc_id"
          label="Danh mục kiến thức"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục kiến thức' }]}
        >
          <Select placeholder="Chọn danh mục">
            <Option value={1}>Tổng quan</Option>
            <Option value={2}>Chuyên sâu</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuestionForm; 