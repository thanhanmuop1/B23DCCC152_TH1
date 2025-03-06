import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Space, Modal, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Question } from '@/models/ExamBank/question';
import useQuestion from '@/hooks/useQuestion';
import QuestionForm from './components/QuestionForm';
import SearchForm from './components/SearchForm';
import { searchService, SearchParams } from '@/services/ExamBank/search';

const QuestionManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const { loading: crudLoading, questions: initialQuestions, fetchQuestions, addQuestion, editQuestion, removeQuestion } = useQuestion();
  
  // Search states
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Handle search
  const handleSearch = async (values: SearchParams) => {
    const hasFilters = values.subjectId || values.difficultyLevel || values.knowledgeCategoryId;
    
    if (!hasFilters) {
      setIsSearchActive(false);
      return;
    }
    
    setSearchLoading(true);
    setIsSearchActive(true);
    
    try {
      const response = await searchService.search(values);
      
      if (response.data.success) {
        setSearchResults(response.data.data || []);
        
        if (response.data.data.length === 0) {
          message.info('Không tìm thấy câu hỏi nào phù hợp với điều kiện tìm kiếm');
        } else {
          message.success(`Tìm thấy ${response.data.count} câu hỏi`);
        }
      } else {
        message.error('Lỗi khi tìm kiếm câu hỏi');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      message.error('Lỗi khi tìm kiếm câu hỏi');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Reset search
  const handleResetSearch = () => {
    setIsSearchActive(false);
    setSearchResults([]);
    fetchQuestions();
  };

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
          if (isSearchActive) {
            // Refresh search results
            setIsSearchActive(false);
            fetchQuestions();
          } else {
            fetchQuestions();
          }
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
      if (isSearchActive) {
        // Refresh search results
        setIsSearchActive(false);
        fetchQuestions();
      } else {
        fetchQuestions();
      }
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
      title: 'Khối kiến thức',
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

  // Determine which data to display
  const displayData = isSearchActive ? searchResults : initialQuestions;
  const isLoading = isSearchActive ? searchLoading : crudLoading;

  return (
    <PageContainer
      title="Quản lý câu hỏi"
      subTitle="Tìm kiếm và quản lý câu hỏi trong ngân hàng đề thi"
    >
      <div style={{ backgroundColor: '#fff', padding: 24 }}>
        {/* Search Form */}
        <SearchForm
          loading={searchLoading}
          onSearch={handleSearch}
          onReset={handleResetSearch}
        />

        {/* Action Buttons */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm câu hỏi
          </Button>
          
          {isSearchActive && searchResults.length > 0 && (
            <div>
              <Tag color="blue">Kết quả tìm kiếm: {searchResults.length} câu hỏi</Tag>
            </div>
          )}
        </div>

        {/* Questions Table */}
        <Table
          columns={columns}
          dataSource={displayData}
          rowKey="id"
          loading={isLoading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng số ${total} câu hỏi`,
          }}
          locale={{
            emptyText: isSearchActive 
              ? 'Không tìm thấy câu hỏi nào phù hợp với điều kiện tìm kiếm' 
              : 'Chưa có câu hỏi nào'
          }}
        />

        {/* Question Form Modal */}
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