import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Space, Modal, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { Exam } from '@/models/exam';
import useExam from '@/hooks/ExamBank/useExam';
import CreateExamForm from './components/CreateExamForm';
import { history } from 'umi';

const ExamManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { loading, exams, fetchExams, createExam, removeExam } = useExam();

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleCreate = () => {
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đề thi này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        const success = await removeExam(id);
        if (success) {
          message.success('Xóa đề thi thành công');
        }
      },
    });
  };

  const handleView = (id: number) => {
    history.push(`/exam-bank/exams/${id}`);
  };

  const handleModalSubmit = async (values: any) => {
    const success = await createExam(values);
    if (success) {
      setIsModalVisible(false);
    }
  };

  const columns = [
    {
      title: 'Tên đề thi',
      dataIndex: 'ten_de',
      key: 'ten_de',
      width: '25%',
    },
    {
      title: 'Môn học',
      key: 'mon_hoc',
      width: '20%',
      render: (record: Exam) => (
        <span>{record.ten_mon} ({record.ma_mon})</span>
      ),
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'so_cau_hoi',
      key: 'so_cau_hoi',
      width: '15%',
      render: (so_cau_hoi: number) => (
        <Tag color="blue">{so_cau_hoi} câu</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngay_tao',
      key: 'ngay_tao',
      width: '20%',
      render: (ngay_tao: string) => new Date(ngay_tao).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Exam) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
          >
            Xem
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
            onClick={handleCreate}
          >
            Tạo đề thi mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={exams}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng số ${total} đề thi`,
          }}
        />

        <CreateExamForm
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleModalSubmit}
        />
      </div>
    </PageContainer>
  );
};

export default ExamManagement; 