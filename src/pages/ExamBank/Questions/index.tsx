import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Space, Modal, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Question } from '@/models/question';
import useQuestion from '@/hooks/useQuestion';
import QuestionForm from './components/QuestionForm';

const QuestionManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const { loading, questions, fetchQuestions, addQuestion, editQuestion, removeQuestion } = useQuestion();

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAdd = () => {
    setEditingQuestion(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: Question) => {
    setEditingQuestion(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        const success = await removeQuestion(id);
        if (success) {
          message.success('Xóa câu hỏi thành công');
        }
      },
    });
  };

  const handleModalSubmit = async (values: any) => {
    let success;
    if (editingQuestion) {
      success = await editQuestion(editingQuestion.id, values);
    } else {
      success = await addQuestion(values);
    }

    if (success) {
      setIsModalVisible(false);
      setEditingQuestion(null);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nội dung',
      dataIndex: 'noi_dung',
      key: 'noi_dung',
      ellipsis: true,
    },
    {
      title: 'Mức độ',
      dataIndex: 'muc_do',
      key: 'muc_do',
      width: 120,
      render: (muc_do: string) => {
        const colors = {
          'Dễ': 'green',
          'Trung bình': 'blue',
          'Khó': 'orange',
          'Rất khó': 'red',
        };
        return <Tag color={colors[muc_do as keyof typeof colors]}>{muc_do}</Tag>;
      },
    },
    {
      title: 'Môn học',
      dataIndex: 'ten_mon',
      key: 'ten_mon',
      width: 200,
    },
    {
      title: 'Danh mục',
      dataIndex: 'ten_danh_muc',
      key: 'ten_danh_muc',
      width: 200,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: Question) => (
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
            Thêm câu hỏi
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng số ${total} câu hỏi`,
          }}
        />

        <QuestionForm
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingQuestion(null);
          }}
          onSubmit={handleModalSubmit}
          initialValues={editingQuestion}
        />
      </div>
    </PageContainer>
  );
};

export default QuestionManagement; 