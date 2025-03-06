import { useEffect, useState } from 'react';
import { Button, Card, Table, message, Modal, Form, Input, Space, Popconfirm, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Subject, SubjectResponse } from '@/models/ExamBank/subjects';
import { subjectService } from '@/services/ExamBank/MonHoc/subjects';

const SubjectPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [form] = Form.useForm();

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectService.getAll();
      setSubjects(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAdd = () => {
    setEditingSubject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Subject) => {
    setEditingSubject(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await subjectService.delete(id);
      message.success('Xóa môn học thành công');
      fetchSubjects();
    } catch (error) {
      message.error('Không thể xóa môn học');
    }
  };

  const handleSubmit = async (values: SubjectResponse) => {
    try {
      if (editingSubject) {
        await subjectService.update(editingSubject.id, values);
        message.success('Cập nhật môn học thành công');
      } else {
        await subjectService.create(values);
        message.success('Thêm môn học thành công');
      }
      setModalVisible(false);
      fetchSubjects();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns: ColumnsType<Subject> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: 'Mã môn',
      dataIndex: 'ma_mon',
      width: '20%',
    },
    {
      title: 'Tên môn',
      dataIndex: 'ten_mon',
      width: '40%',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'so_tin_chi',
      width: '10%',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Quản lý môn học"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={subjects}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingSubject ? 'Sửa môn học' : 'Thêm môn học mới'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingSubject ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectPage;