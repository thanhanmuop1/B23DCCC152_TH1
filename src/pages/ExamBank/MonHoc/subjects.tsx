import { useEffect, useState } from 'react';
import { Button, Card, Table, message, Modal, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Subject, SubjectResponse } from '@/models/ExamBank/subjects';
import { useSubjects } from '@/hooks/ExamBank/useSubjects';
import SubjectForm from '@/components/ExamBank/Subject/SubjectForm';

const SubjectPage = () => {
  const {
    subjects,
    loading,
    editingSubject,
    setEditingSubject,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  } = useSubjects();

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAdd = () => {
    setEditingSubject(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Subject) => {
    setEditingSubject(record);
    setModalVisible(true);
  };

  const handleSubmit = async (values: SubjectResponse) => {
    const success = editingSubject 
      ? await updateSubject(editingSubject.id, values)
      : await createSubject(values);
    
    if (success) {
      setModalVisible(false);
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
            onConfirm={() => deleteSubject(record.id)}
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
        <SubjectForm
          initialValues={editingSubject}
          onSubmit={handleSubmit}
          onCancel={() => setModalVisible(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default SubjectPage;