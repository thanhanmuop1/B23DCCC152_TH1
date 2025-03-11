import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Space, FormInstance, Alert } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSubjects } from '@/hooks/ExamBank/useSubjects';

const CreateNewStructure: React.FC<{ form: FormInstance }> = ({ form }) => {
  const difficultyLevels = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
  const { subjects, fetchSubjects } = useSubjects();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const calculateTotal = () => {
    const details = form.getFieldValue('chi_tiet') || [];
    return details.reduce((sum: number, detail: any) => sum + (detail.so_luong || 0), 0);
  };

  return (
    <>
      <Form.Item
        name="mon_hoc_id"
        label="Môn học"
        rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
      >
        <Select 
          placeholder="Chọn môn học"
          showSearch
          optionFilterProp="children"
        >
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
        <Input placeholder="Nhập tên đề thi" />
      </Form.Item>

      <Alert
        message={`Tổng số câu hỏi: ${calculateTotal()}`}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form.List
        name="chi_tiet"
        initialValue={[{ muc_do: 'Dễ', so_luong: 1 }]}
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
                  rules={[
                    { required: true, message: 'Nhập số lượng' },
                    { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' }
                  ]}
                >
                  <InputNumber min={1} placeholder="Số câu" />
                </Form.Item>

                {fields.length > 1 && (
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                )}
              </Space>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Thêm mức độ
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
};

export default CreateNewStructure; 