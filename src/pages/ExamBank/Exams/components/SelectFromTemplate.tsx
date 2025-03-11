import React, { useEffect } from 'react';
import { Form, Select, Input, FormInstance, Space, Tag } from 'antd';
import { useSubjects } from '@/hooks/ExamBank/useSubjects';
import useExamTemplate from '@/hooks/ExamBank/useExamTemplate';
import { ExamTemplate } from '@/models/ExamBank/examTemplate';

const SelectFromTemplate: React.FC<{ form: FormInstance }> = ({ form }) => {
  const { subjects, fetchSubjects } = useSubjects();
  const { templates, fetchTemplates } = useExamTemplate();
  const selectedMonHoc = Form.useWatch('mon_hoc_id', form);

  useEffect(() => {
    fetchTemplates();
    fetchSubjects();
  }, []);

  const renderTemplateDetails = (template: ExamTemplate) => (
    <Space direction="vertical" size="small">
      <div>
        <Tag color={template.loai_cau_truc === 'so_luong' ? 'blue' : 'purple'}>
          {template.loai_cau_truc === 'so_luong' ? 'Theo số lượng' : 'Theo phần trăm'}
        </Tag>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {template.chi_tiet.map(detail => (
          <Tag
            key={detail.muc_do}
            color={
              detail.muc_do === 'Dễ' ? 'green' :
              detail.muc_do === 'Trung bình' ? 'blue' :
              detail.muc_do === 'Khó' ? 'orange' : 'red'
            }
          >
            {detail.muc_do}: {template.loai_cau_truc === 'so_luong' ? 
              `${detail.so_luong} câu` : 
              `${detail.phan_tram}%`}
          </Tag>
        ))}
      </div>
    </Space>
  );

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
        name="template_id"
        label="Chọn mẫu cấu trúc"
        rules={[{ required: true, message: 'Vui lòng chọn mẫu cấu trúc' }]}
      >
        <Select 
          placeholder="Chọn mẫu"
          disabled={!selectedMonHoc}
        >
          {templates
            .filter(template => template.mon_hoc_id === selectedMonHoc)
            .map(template => (
              <Select.Option key={template.id} value={template.id}>
                <div style={{ padding: '8px 0' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    {template.ten_cau_truc}
                  </div>
                  {renderTemplateDetails(template)}
                </div>
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
    </>
  );
};

export default SelectFromTemplate; 