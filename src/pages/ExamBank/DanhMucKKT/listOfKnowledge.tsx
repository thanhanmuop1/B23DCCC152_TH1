import { useEffect, useState } from 'react';
import { Button, Card, Table, message, Modal, Form, Input, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ListOfKnowledge, ListOfKnowledgeResponse } from '@/models/listOfKnowledge';
import { listOfKnowledgeService } from '@/services/ExamBank/DanhMucKKT/listOfKnowledge';

const ListOfKnowledgePage = () => {
  const [categories, setCategories] = useState<ListOfKnowledge[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ListOfKnowledge | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await listOfKnowledgeService.getAll();
      setCategories(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách khối kiến thức');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ListOfKnowledge) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await listOfKnowledgeService.delete(id);
      message.success('Xóa khối kiến thức thành công');
      fetchCategories();
    } catch (error) {
      message.error('Không thể xóa khối kiến thức');
    }
  };

  const handleSubmit = async (values: ListOfKnowledgeResponse) => {
    try {
      if (editingCategory) {
        await listOfKnowledgeService.update(editingCategory.id, values);
        message.success('Cập nhật khối kiến thức thành công');
      } else {
        await listOfKnowledgeService.create(values);
        message.success('Thêm khối kiến thức thành công');
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns: ColumnsType<ListOfKnowledge> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'ten_danh_muc',
      width: '70%',
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
        title="Quản lý danh mục khối kiến thức"
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
          dataSource={categories}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingCategory ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức mới'}
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
            name="ten_danh_muc"
            label="Tên danh mục"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục' },
              { max: 255, message: 'Tên danh mục không được vượt quá 255 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListOfKnowledgePage;