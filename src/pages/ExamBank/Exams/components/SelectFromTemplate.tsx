import React, { useEffect, useState } from 'react';
import { Form, Select, Input } from 'antd';

const SelectFromTemplate: React.FC<{ form: FormInstance }> = ({ form }) => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Fetch templates from API
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/exam-templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    fetchTemplates();
  }, []);

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
        name="template_id"
        label="Chọn mẫu cấu trúc"
        rules={[{ required: true, message: 'Vui lòng chọn mẫu cấu trúc' }]}
      >
        <Select placeholder="Chọn mẫu">
          {templates.map(template => (
            <Select.Option key={template.id} value={template.id}>
              {template.ten_cau_truc}
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
    </>
  );
};

export default SelectFromTemplate; 