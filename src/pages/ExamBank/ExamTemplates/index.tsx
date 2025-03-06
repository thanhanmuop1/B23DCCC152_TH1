import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ExamTemplate } from '@/models/examTemplate';
import useExamTemplate from '@/hooks/useExamTemplate';
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

  const columns = [
    {
      title: 'Tên cấu trúc',
      dataIndex: 'ten_cau_truc',
      key: 'ten_cau_truc',
      width: '30%',
    },
    {
      title: 'Số câu dễ',
      key: 'de',
      width: '15%',
      render: (record: ExamTemplate) => {
        const detail = record.chi_tiet.find(d => d.muc_do === 'Dễ');
        return detail ? detail.so_luong : 0;
      },
    },
    {
      title: 'Số câu trung bình',
      key: 'trung_binh',
      width: '15%',
      render: (record: ExamTemplate) => {
        const detail = record.chi_tiet.find(d => d.muc_do === 'Trung bình');
        return detail ? detail.so_luong : 0;
      },
    },
    {
      title: 'Số câu khó',
      key: 'kho',
      width: '15%',
      render: (record: ExamTemplate) => {
        const detail = record.chi_tiet.find(d => d.muc_do === 'Khó');
        return detail ? detail.so_luong : 0;
      },
    },
    {
      title: 'Số câu rất khó',
      key: 'rat_kho',
      width: '15%',
      render: (record: ExamTemplate) => {
        const detail = record.chi_tiet.find(d => d.muc_do === 'Rất khó');
        return detail ? detail.so_luong : 0;
      },
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