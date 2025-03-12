import React, { useState } from 'react';
import { Modal, Form, Tabs, Alert } from 'antd';
import SelectFromTemplate from './SelectFromTemplate';
import CreateNewStructure from './CreateNewStructure';
import useExamTemplate from '@/hooks/ExamBank/useExamTemplate';
import { validateExamForm } from '@/models/ExamBank/examFormHandler';
import { createExamRequestFromForm } from '@/models/exam';
import { ExamTemplate } from '@/models/ExamBank/examTemplate';

interface CreateExamFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const { TabPane } = Tabs;

const CreateExamForm: React.FC<CreateExamFormProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const { templates } = useExamTemplate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ExamTemplate | null>(null);

  const handleTemplateSelected = (template: ExamTemplate) => {
    setSelectedTemplate(template);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    
    try {
      const values = await form.validateFields();
      
      if (activeTab === '1' && selectedTemplate) {
        const requestData = {
          mon_hoc_id: values.mon_hoc_id,
          ten_de: values.ten_de,
          template_id: selectedTemplate.id,
          cau_truc: selectedTemplate.chi_tiet.map(detail => ({
            muc_do: detail.muc_do,
            so_luong: selectedTemplate.loai_cau_truc === 'so_luong' 
              ? detail.so_luong 
              : Math.round((detail.phan_tram || 0) / 100 * (values.total_questions || 100)),
            danh_muc_id: 1
          }))
        };
        
        onSubmit(requestData);
      } else if (activeTab === '2') {
        const isValid = await validateExamForm(form, activeTab === '1');
        
        if (!isValid) {
          return;
        }
        
        try {
          const formattedValues = createExamRequestFromForm(
            values, 
            activeTab === '1', // isFromTemplate
            templates
          );
          
          console.log('Formatted values:', formattedValues);
          onSubmit(formattedValues);
        } catch (formatError: any) {
          setErrorMessage(formatError.message || 'Có lỗi xảy ra khi xử lý dữ liệu');
          console.error('Error formatting values:', formatError);
        }
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleTabChange = (key: string) => {
    // Lưu tab trước khi chuyển
    const previousTab = activeTab;
    
    // Cập nhật tab mới
    setActiveTab(key);
    setErrorMessage(null);
    
    // Reset validation errors của tab trước đó
    if (previousTab === '1' && key === '2') {
      // Từ tab template sang tab tạo mới
      form.setFields([
        { name: 'template_id', errors: [] }
      ]);
    } else if (previousTab === '2' && key === '1') {
      // Từ tab tạo mới sang tab template
      form.setFields([
        { name: 'chi_tiet', errors: [] }
      ]);
    }
  };

  return (
    <Modal
      title="Tạo đề thi mới"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        setErrorMessage(null);
        onCancel();
      }}
      onOk={handleSubmit}
      width={800}
      destroyOnClose
    >
      <Alert
        message="Chọn cách tạo đề thi"
        description="Bạn có thể tạo đề thi từ mẫu có sẵn hoặc tạo cấu trúc mới"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {errorMessage && (
        <Alert
          message="Lỗi"
          description={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          closable
          onClose={() => setErrorMessage(null)}
        />
      )}

      <Form form={form} layout="vertical">
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Tạo từ mẫu" key="1">
            <SelectFromTemplate 
              form={form} 
              onTemplateSelected={handleTemplateSelected} 
            />
          </TabPane>
          <TabPane tab="Tạo cấu trúc mới" key="2">
            <CreateNewStructure form={form} />
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default CreateExamForm; 