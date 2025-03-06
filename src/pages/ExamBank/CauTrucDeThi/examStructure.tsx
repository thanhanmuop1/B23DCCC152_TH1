import { useEffect, useState } from 'react';
import { Button, Card, Table, message, Modal, Form, Input, Space, Popconfirm, Select, InputNumber, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ExamStructure, ExamStructureResponse } from '@/models/ExamBank/examStructure';
import { examService } from '@/services/ExamBank/CauTrucDeThi/examStructure';
import axios from 'axios';

const { Option } = Select;

interface MonHoc {
  id: number;
  ten_mon: string;
}

interface DanhMucKhoiKienThuc {
  id: number;
  ten_danh_muc: string;
}

const difficultyLevels = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const ExamStructurePage = () => {
  const [structures, setStructures] = useState<ExamStructure[]>([]);
  const [monHoc, setMonHoc] = useState<MonHoc[]>([]);
  const [danhMuc, setDanhMuc] = useState<DanhMucKhoiKienThuc[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStructure, setEditingStructure] = useState<ExamStructure | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [structuresRes, monHocRes, danhMucRes] = await Promise.all([
        examService.getAllStructures(),
        axios.get<MonHoc[]>('http://localhost:3000/api/subjects'),
        axios.get<DanhMucKhoiKienThuc[]>('http://localhost:3000/api/knowledge-categories')
      ]);

      setStructures(structuresRes.data);
      setMonHoc(monHocRes.data);
      setDanhMuc(danhMucRes.data);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingStructure(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ExamStructure) => {
    setEditingStructure(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await examService.deleteStructure(id);
      message.success('Xóa cấu trúc đề thi thành công');
      fetchData();
    } catch (error) {
      message.error('Không thể xóa cấu trúc đề thi');
    }
  };

  const handleSubmit = async (values: ExamStructureResponse) => {
    try {
      if (editingStructure) {
        await examService.updateStructure(editingStructure.id, values);
        message.success('Cập nhật cấu trúc đề thi thành công');
      } else {
        await examService.createStructure(values);
        message.success('Thêm cấu trúc đề thi thành công');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns: ColumnsType<ExamStructure> = [
    {
      title: 'Môn học',
      dataIndex: 'ten_mon',
      width: '25%',
    },
    {
      title: 'Mức độ',
      dataIndex: 'muc_do',
      width: '15%',
    },
    {
      title: 'Danh mục',
      dataIndex: 'ten_danh_muc',
      width: '25%',
    },
    {
      title: 'Số lượng câu hỏi',
      dataIndex: 'so_luong',
      width: '15%',
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
        title="Quản lý cấu trúc đề thi"
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
          dataSource={structures}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingStructure ? 'Sửa cấu trúc đề thi' : 'Thêm cấu trúc đề thi mới'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="mon_hoc_id"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select placeholder="Chọn môn học">
              {monHoc.map(mon => (
                <Option key={mon.id} value={mon.id}>
                  {mon.ten_mon}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="muc_do"
            label="Mức độ"
            rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
          >
            <Select placeholder="Chọn mức độ">
              {difficultyLevels.map(level => (
                <Option key={level} value={level}>
                  {level}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="danh_muc_id"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {danhMuc.map(dm => (
                <Option key={dm.id} value={dm.id}>
                  {dm.ten_danh_muc}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="so_luong"
            label="Số lượng câu hỏi"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng câu hỏi' },
              { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' }
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingStructure ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamStructurePage;