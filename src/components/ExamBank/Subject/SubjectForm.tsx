import { Form, Input, InputNumber, Button, Space } from 'antd';
import { Subject, SubjectResponse } from '@/models/ExamBank/subjects';

interface SubjectFormProps {
  initialValues?: Subject;
  onSubmit: (values: SubjectResponse) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        name="ma_mon"
        label="Mã môn"
        rules={[
          { required: true, message: 'Vui lòng nhập mã môn' },
          { max: 50, message: 'Mã môn không được vượt quá 50 ký tự' }
        ]}
      >
        <Input placeholder="Nhập mã môn" />
      </Form.Item>

      <Form.Item
        name="ten_mon"
        label="Tên môn"
        rules={[
          { required: true, message: 'Vui lòng nhập tên môn' },
          { max: 255, message: 'Tên môn không được vượt quá 255 ký tự' }
        ]}
      >
        <Input placeholder="Nhập tên môn" />
      </Form.Item>

      <Form.Item
        name="so_tin_chi"
        label="Số tín chỉ"
        rules={[
          { required: true, message: 'Vui lòng nhập số tín chỉ' },
          { type: 'number', min: 1, message: 'Số tín chỉ phải lớn hơn 0' }
        ]}
      >
        <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số tín chỉ" />
      </Form.Item>

      <Form.Item className="text-right mb-0">
        <Space>
          <Button onClick={onCancel}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SubjectForm; 