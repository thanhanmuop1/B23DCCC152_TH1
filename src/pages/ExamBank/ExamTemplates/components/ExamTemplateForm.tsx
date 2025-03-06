import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ExamTemplate } from '@/models/examTemplate';

interface ExamTemplateFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: ExamTemplate | null;
}

const difficultyLevels = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const ExamTemplateForm: React.FC<ExamTemplateFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ten_cau_truc: initialValues.ten_cau_truc,
          chi_tiet: initialValues.chi_tiet,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Sửa cấu trúc đề thi' : 'Thêm cấu trúc đề thi mới'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ chi_tiet: [{ muc_do: 'Dễ', so_luong: 1 }] }}
      >
        <Form.Item
          name="ten_cau_truc"
          label="Tên cấu trúc"
          rules={[{ required: true, message: 'Vui lòng nhập tên cấu trúc' }]}
        >
          <Input placeholder="Nhập tên cấu trúc đề thi" />
        </Form.Item>

        <Form.List name="chi_tiet">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ display: 'flex', marginBottom: 8, gap: 8 }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'muc_do']}
                    rules={[{ required: true, message: 'Chọn mức độ' }]}
                    style={{ flex: 1 }}
                  >
                    <select className="ant-input" style={{ width: '100%' }}>
                      {difficultyLevels.map(level => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'so_luong']}
                    rules={[{ required: true, message: 'Nhập số lượng' }]}
                    style={{ flex: 1 }}
                  >
                    <InputNumber
                      min={1}
                      placeholder="Số lượng"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  )}
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm mức độ
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ExamTemplateForm; 