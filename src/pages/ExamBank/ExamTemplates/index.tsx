import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Space, Modal, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ExamTemplate } from '@/models/examTemplate';
import useExamTemplate from '@/hooks/ExamBank/useExamTemplate';
import ExamTemplateForm from './components/ExamTemplateForm';

const ExamTemplateManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ExamTemplate | null>(null);
  const { loading, templates, fetchTemplates, addTemplate, editTemplate, removeTemplate } = useExamTemplate();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleAdd = () => {
    setEditingTemplate(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: ExamTemplate) => {
    setEditingTemplate(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa cấu trúc đề thi này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        const success = await removeTemplate(id);
        if (success) {
          message.success('Xóa cấu trúc đề thi thành công');
        }
      },
    });
  };

  const handleModalSubmit = async (values: any) => {
    let success;
    if (editingTemplate) {
      success = await editTemplate(editingTemplate.id, values);
    } else {
      success = await addTemplate(values);
    }

    if (success) {
      setIsModalVisible(false);
      setEditingTemplate(null);
    }
  };

  const renderStructureDetails = (record: ExamTemplate) => {
    return record.chi_tiet.map(detail => {
      const value = record.loai_cau_truc === 'so_luong' 
        ? `${detail.so_luong} câu` 
        : `${detail.phan_tram}%`;
      return (
        <div key={detail.muc_do}>
          <Tag color={
            detail.muc_do === 'Dễ' ? 'green' :
            detail.muc_do === 'Trung bình' ? 'blue' :
            detail.muc_do === 'Khó' ? 'orange' : 'red'
          }>
            {detail.muc_do}: {value}
          </Tag>
        </div>
      );
    });
  };

  const columns = [
    {
      title: 'Tên cấu trúc',
      dataIndex: 'ten_cau_truc',
      key: 'ten_cau_truc',
      width: '25%',
    },
    {
      title: 'Loại cấu trúc',
      dataIndex: 'loai_cau_truc',
      key: 'loai_cau_truc',
      width: '15%',
      render: (type: string) => (
        <Tag color={type === 'so_luong' ? 'blue' : 'purple'}>
          {type === 'so_luong' ? 'Số lượng' : 'Phần trăm'}
        </Tag>
      ),
    },
    {
      title: 'Chi tiết cấu trúc',
      key: 'chi_tiet',
      width: '40%',
      render: (_, record: ExamTemplate) => renderStructureDetails(record),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: ExamTemplate) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ backgroundColor: '#fff', padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm cấu trúc đề thi
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng số ${total} cấu trúc`,
          }}
        />

        <ExamTemplateForm
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingTemplate(null);
          }}
          onSubmit={handleModalSubmit}
          initialValues={editingTemplate}
        />
      </div>
    </PageContainer>
  );
};

export default ExamTemplateManagement; 