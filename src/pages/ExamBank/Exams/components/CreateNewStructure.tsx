import React from 'react';
import { Form, Input, Select, InputNumber, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const CreateNewStructure: React.FC<{ form: FormInstance }> = ({ form }) => {
  const difficultyLevels = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

  return (
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
                    {difficultyLevels.map(level => (
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
  );
};

export default CreateNewStructure; 