import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Radio, Space, Tag, Dropdown } from 'antd';
import { MinusCircleOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import type { ExamRequest } from '@/models/exam';
import SelectTemplateModal from './SelectTemplateModal';

interface CreateExamFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ExamRequest) => void;
}

const difficultyLevels = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const CreateExamForm: React.FC<CreateExamFormProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [showCustomStructure, setShowCustomStructure] = useState(false);

  const handleTemplateSelect = (templateId: number, totalQuestions?: number) => {
    setIsTemplateModalVisible(false);
    form.setFieldsValue({
      template_id: templateId,
      total_questions: totalQuestions,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Form.Provider>
      <Modal
        title="Tạo đề thi mới"
        visible={visible}
        onCancel={onCancel}
        onOk={handleSubmit}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            name="ten_de"
            label="Tên đề thi"
            rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
          >
            <Input placeholder="Nhập tên đề thi" />
          </Form.Item>

          <Form.Item
            name="mon_hoc_id"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select placeholder="Chọn môn học">
              <Select.Option value={1}>Khoa học máy tính cơ bản</Select.Option>
              <Select.Option value={2}>Toán rời rạc</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Cấu trúc đề thi"
            required
          >
            <Select
              placeholder="Chọn hoặc tạo cấu trúc đề thi"
              dropdownRender={(menu) => (
                <div>
                  <div style={{ padding: '8px', borderBottom: '1px solid #e8e8e8' }}>
                    <Button
                      type="text"
                      block
                      onClick={() => {
                        setIsTemplateModalVisible(true);
                        setShowCustomStructure(false);
                      }}
                    >
                      Chọn từ mẫu có sẵn
                    </Button>
                    <Button
                      type="text"
                      block
                      onClick={() => {
                        setShowCustomStructure(true);
                        setIsTemplateModalVisible(false);
                      }}
                    >
                      Tạo cấu trúc mới
                    </Button>
                  </div>
                </div>
              )}
            />
          </Form.Item>

          {showCustomStructure && (
            <>
              <Form.Item
                name="loai_cau_truc"
                label="Loại cấu trúc"
                rules={[{ required: true, message: 'Vui lòng chọn loại cấu trúc' }]}
              >
                <Radio.Group>
                  <Radio value="so_luong">Theo số lượng</Radio>
                  <Radio value="phan_tram">Theo phần trăm</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.List
                name="chi_tiet"
                rules={[
                  {
                    validator: async (_, details) => {
                      if (!details || details.length < 1) {
                        return Promise.reject(new Error('Vui lòng thêm ít nhất một mức độ'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {fields.map((field, index) => (
                      <Space key={field.key} align="baseline">
                        <Form.Item
                          {...field}
                          name={[field.name, 'muc_do']}
                          rules={[{ required: true, message: 'Chọn mức độ' }]}
                        >
                          <Select style={{ width: 120 }} placeholder="Mức độ">
                            {difficultyLevels.map(level => (
                              <Select.Option key={level} value={level}>
                                {level}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          {...field}
                          name={[field.name, form.getFieldValue('loai_cau_truc') === 'so_luong' ? 'so_luong' : 'phan_tram']}
                          rules={[{ required: true, message: 'Nhập giá trị' }]}
                        >
                          <InputNumber
                            min={1}
                            placeholder={form.getFieldValue('loai_cau_truc') === 'so_luong' ? 'Số câu' : 'Phần trăm'}
                          />
                        </Form.Item>

                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    ))}

                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm mức độ
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </div>
                )}
              </Form.List>

              {form.getFieldValue('loai_cau_truc') === 'phan_tram' && (
                <Form.Item
                  name="total_questions"
                  label="Tổng số câu hỏi"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tổng số câu hỏi' },
                    { type: 'number', min: 1, message: 'Số câu hỏi phải lớn hơn 0' }
                  ]}
                >
                  <InputNumber
                    min={1}
                    placeholder="Nhập tổng số câu hỏi"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              )}
            </>
          )}

          <Form.Item
            name="template_id"
            hidden
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <SelectTemplateModal
        open={isTemplateModalVisible}
        onCancel={() => setIsTemplateModalVisible(false)}
        onSelect={handleTemplateSelect}
      />
    </Form.Provider>
  );
};

export default CreateExamForm; 