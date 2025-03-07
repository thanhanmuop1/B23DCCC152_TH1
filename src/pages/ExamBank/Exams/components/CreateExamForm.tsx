import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Radio, Space, Tag, Dropdown, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import { useSubjects } from '@/hooks/ExamBank/useSubjects';
import type { RadioChangeEvent } from 'antd';

interface CreateExamFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}


const CreateExamForm: React.FC<CreateExamFormProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [createType, setCreateType] = useState<'new' | 'template' | null>(null);
  const [form] = Form.useForm();
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const { subjects, loading: subjectsLoading, fetchSubjects } = useSubjects();

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleCreateTypeChange = (e: RadioChangeEvent) => {
    setCreateType(e.target.value);
    form.resetFields(['mon_hoc_id', 'ten_de', 'chi_tiet', 'template_id']);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (createType === 'template') {
        // Xử lý tạo đề từ mẫu
        const templateData = {
          mon_hoc_id: values.mon_hoc_id,
          ten_de: values.ten_de,
          template_id: values.template_id
        };
        await onSubmit(templateData);
      } else {
        // Xử lý tạo cấu trúc mới
        const newStructureData = {
          mon_hoc_id: values.mon_hoc_id,
          ten_de: values.ten_de,
          cau_truc: values.chi_tiet.map((detail: any) => ({
            muc_do: detail.muc_do,
            so_luong: detail.so_luong,
            danh_muc_id: 1
          }))
        };
        await onSubmit(newStructureData);
      }
      onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi tạo đề thi');
    }
  };

  return (
    <Modal
      title="Tạo đề thi mới"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="createType"
          label="Chọn cách tạo đề thi"
          rules={[{ required: true, message: 'Vui lòng chọn cách tạo đề thi' }]}
        >
          <Radio.Group onChange={handleCreateTypeChange}>
            <Space direction="vertical">
              <Radio value="new">Tạo cấu trúc mới</Radio>
              <Radio value="template">Chọn từ mẫu có sẵn</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        {createType === 'new' && (
          <>
            <Form.Item
              name="mon_hoc_id"
              label="Môn học"
              rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
            >
              <Select placeholder="Chọn môn học">
                {subjects.map(subject => (
                  <Select.Option key={subject.id} value={subject.id}>
                    {subject.ma_mon} - {subject.ten_mon}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="ten_de"
              label="Tên đề thi"
              rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
            >
              <Input />
            </Form.Item>

            <Form.List
              name="chi_tiet"
              rules={[{ required: true, message: 'Vui lòng thêm ít nhất một mức độ' }]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        name={[field.name, 'muc_do']}
                        rules={[{ required: true, message: 'Chọn mức độ' }]}
                      >
                        <Select style={{ width: 120 }} placeholder="Mức độ">
                          {['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(level => (
                            <Select.Option key={level} value={level}>
                              {level}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'so_luong']}
                        rules={[{ required: true, message: 'Nhập số lượng' }]}
                      >
                        <InputNumber min={1} placeholder="Số câu" />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}

                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm mức độ
                  </Button>
                </>
              )}
            </Form.List>
          </>
        )}

        {createType === 'template' && (
          <>
            <Form.Item
              name="mon_hoc_id"
              label="Môn học"
              rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
            >
              <Select placeholder="Chọn môn học">
                {/* Options từ API */}
              </Select>
            </Form.Item>

            <Form.Item
              name="template_id"
              label="Chọn mẫu cấu trúc"
              rules={[{ required: true, message: 'Vui lòng chọn mẫu cấu trúc' }]}
            >
              <Select placeholder="Chọn mẫu">
                {/* Options từ API */}
              </Select>
            </Form.Item>

            <Form.Item
              name="ten_de"
              label="Tên đề thi"
              rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {createType === 'template' ? 'Tạo đề từ mẫu' : 'Tạo cấu trúc mới'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateExamForm; 