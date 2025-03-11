import React, { useState } from 'react';
import { Modal, Form, Tabs, Alert } from 'antd';
import SelectFromTemplate from './SelectFromTemplate';
import CreateNewStructure from './CreateNewStructure';
import useExamTemplate from '@/hooks/ExamBank/useExamTemplate';
import { createExamRequestFromForm } from '@/models/exam';

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      try {
        const formattedValues = createExamRequestFromForm(
          values, 
          activeTab === '1', // isFromTemplate
          templates
        );
        
        console.log('Formatted values:', formattedValues);
        onSubmit(formattedValues);
      } catch (error) {
        console.error('Error formatting values:', error);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Tạo đề thi mới"
      visible={visible}
      onCancel={() => {
        form.resetFields();
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

      <Form form={form} layout="vertical">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tạo từ mẫu" key="1">
            <SelectFromTemplate form={form} />
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