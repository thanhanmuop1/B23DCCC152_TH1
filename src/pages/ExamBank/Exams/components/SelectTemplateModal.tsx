import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Radio, Space, Tag, Alert, Select, Input } from 'antd';
import type { ExamTemplate } from '@/models/ExamBank/examTemplate';
import useExamTemplate from '@/hooks/ExamBank/useExamTemplate';
import { useSubjects } from '@/hooks/ExamBank/useSubjects';

interface SelectTemplateModalProps {
  open: boolean;
  onCancel: () => void;
  onSelect: (templateId: number, monHocId: number, tenDe: string, totalQuestions?: number) => void;
}

const SelectTemplateModal: React.FC<SelectTemplateModalProps> = ({
  open,
  onCancel,
  onSelect,
}) => {
  const [form] = Form.useForm();
  const { templates, fetchTemplates, loading } = useExamTemplate();
  const { subjects, loading: subjectsLoading, fetchSubjects } = useSubjects();
  const [selectedTemplate, setSelectedTemplate] = useState<ExamTemplate | null>(null);

  useEffect(() => {
    if (open) {
      fetchTemplates();
      fetchSubjects();
    }
  }, [open]);

  useEffect(() => {
    if (!open && form) {
      form.resetFields();
      setSelectedTemplate(null);
    }
  }, [open]);

  const handleTemplateSelect = (template: ExamTemplate) => {
    setSelectedTemplate(template);
    if (template.loai_cau_truc === 'so_luong') {
      // Nếu là template theo số lượng, tính tổng số câu
      const totalQuestions = template.chi_tiet.reduce((sum, detail) => sum + (detail.so_luong || 0), 0);
      form.setFieldsValue({ total_questions: totalQuestions });
    } else {
      // Nếu là template theo phần trăm, để người dùng nhập số câu
      form.setFieldsValue({ total_questions: undefined });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedTemplate) {
        return;
      }

      const values = await form.validateFields();
      onSelect(
        selectedTemplate.id, 
        values.mon_hoc_id,
        values.ten_de,
        values.total_questions
      );
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const renderTemplateDetails = (template: ExamTemplate) => {
    return (
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
  };

  return (
    <Modal
      title="Chọn cấu trúc đề thi"
      visible={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      okButtonProps={{ disabled: !selectedTemplate }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="mon_hoc_id"
          label="Môn học"
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select 
            placeholder="Chọn môn học"
            loading={subjectsLoading}
            optionFilterProp="children"
            showSearch
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

        <Form.Item label="Chọn cấu trúc đề thi">
          <Radio.Group 
            onChange={(e) => handleTemplateSelect(e.target.value)} 
            value={selectedTemplate}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {templates.map(template => (
                <Radio key={template.id} value={template}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>{template.ten_cau_truc}</strong>
                  </div>
                  {renderTemplateDetails(template)}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        {selectedTemplate && selectedTemplate.loai_cau_truc === 'phan_tram' && (
          <>
            <Alert
              message="Cấu trúc này sử dụng phần trăm, vui lòng nhập tổng số câu hỏi mong muốn"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
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
          </>
        )}
      </Form>
    </Modal>
  );
};

export default SelectTemplateModal; 