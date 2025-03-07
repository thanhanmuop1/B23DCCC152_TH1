import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Descriptions, Table, Tag, Button, Space, Modal, message, Alert } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useParams, history } from 'umi';
import useExam from '@/hooks/ExamBank/useExam';
import type { ExamQuestion } from '@/models/exam';

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, randomizing, currentExam, fetchExamDetail, randomizeQuestions } = useExam();
  const [randomized, setRandomized] = useState(false);
  const [previousOrder, setPreviousOrder] = useState<ExamQuestion[]>([]);

  useEffect(() => {
    if (id) {
      fetchExamDetail(Number(id));
    }
  }, [id, fetchExamDetail]);

  const handleBack = () => {
    history.push('/exam-bank/exams');
  };

  const handlePrint = () => {
    window.print();
  };

  // Thêm hàm xử lý random câu hỏi
  const handleRandomize = () => {
    if (!id) {
      message.error('Không tìm thấy ID đề thi');
      return;
    }

    if (currentExam?.cau_hoi && currentExam.cau_hoi.length > 0) {
      // Lưu lại thứ tự câu hỏi trước khi random
      setPreviousOrder([...currentExam.cau_hoi]);
    }

    Modal.confirm({
      title: 'Xác nhận random',
      content: 'Bạn có chắc chắn muốn random vị trí các câu hỏi trong đề thi này không?',
      okText: 'Random',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await randomizeQuestions(Number(id));
          setRandomized(true);
          // Tự động cuộn xuống bảng câu hỏi sau khi random
          setTimeout(() => {
            const tableElement = document.getElementById('questions-table');
            if (tableElement) {
              tableElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 500);
        } catch (error) {
          console.error('Error randomizing questions:', error);
          message.error('Đã xảy ra lỗi khi random vị trí câu hỏi');
        }
      },
    });
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'noi_dung',
      key: 'noi_dung',
      width: '50%',
      render: (text: string, record: ExamQuestion, index: number) => {
        // Highlight câu hỏi đã thay đổi vị trí
        const previousIndex = previousOrder.findIndex(q => q.id === record.id);
        const positionChanged = randomized && previousIndex !== -1 && previousIndex !== index;
        
        return (
          <div style={{ 
            backgroundColor: positionChanged ? '#fffbe6' : 'transparent',
            padding: positionChanged ? '8px' : '0',
            borderRadius: '4px',
            border: positionChanged ? '1px solid #faad14' : 'none'
          }}>
            {text}
            {positionChanged && (
              <div style={{ fontSize: '12px', color: '#faad14', marginTop: '4px' }}>
                Đã thay đổi từ vị trí {previousIndex + 1}
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: 'Mức độ',
      dataIndex: 'muc_do',
      key: 'muc_do',
      width: '15%',
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
      title: 'Danh mục',
      dataIndex: 'ten_danh_muc',
      key: 'ten_danh_muc',
      width: '20%',
    },
  ];

  // Nhóm câu hỏi theo mức độ
  const questionsByDifficulty = currentExam?.cau_hoi?.reduce((acc, question) => {
    const { muc_do } = question;
    if (!acc[muc_do]) {
      acc[muc_do] = [];
    }
    acc[muc_do].push(question);
    return acc;
  }, {} as Record<string, ExamQuestion[]>) || {};

  return (
    <PageContainer
      header={{
        title: 'Chi tiết đề thi',
        onBack: handleBack,
      }}
    >
      <Card loading={loading}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                In đề thi
              </Button>
              {/* Nút Random */}
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={handleRandomize}
                loading={randomizing}
                style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
              >
                Random vị trí câu hỏi
              </Button>
            </Space>
          </div>

          {randomized && (
            <Alert
              message="Đã random vị trí câu hỏi thành công"
              description="Vị trí các câu hỏi đã được thay đổi ngẫu nhiên. Các câu hỏi đã thay đổi vị trí được đánh dấu màu vàng."
              type="success"
              showIcon
              closable
              onClose={() => setRandomized(false)}
              style={{ marginBottom: 16 }}
            />
          )}

          {currentExam && (
            <>
              <Descriptions title="Thông tin đề thi" bordered>
                <Descriptions.Item label="Tên đề thi" span={3}>
                  {currentExam.ten_de}
                </Descriptions.Item>
                <Descriptions.Item label="Môn học" span={2}>
                  {currentExam.ten_mon} ({currentExam.ma_mon})
                </Descriptions.Item>
                <Descriptions.Item label="Số câu hỏi">
                  {currentExam.cau_hoi?.length || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo" span={3}>
                  {new Date(currentExam.ngay_tao).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
              </Descriptions>

              <div>
                <h3>Cấu trúc đề thi:</h3>
                {Object.entries(questionsByDifficulty).map(([difficulty, questions]) => (
                  <div key={difficulty} style={{ display: 'inline-block', marginRight: 16 }}>
                    <Tag color={
                      difficulty === 'Dễ' ? 'green' :
                      difficulty === 'Trung bình' ? 'blue' :
                      difficulty === 'Khó' ? 'orange' : 'red'
                    }>
                      {difficulty}: {questions.length} câu
                    </Tag>
                  </div>
                ))}
              </div>

              <Table
                id="questions-table"
                columns={columns}
                dataSource={currentExam.cau_hoi || []}
                rowKey="id"
                pagination={false}
                bordered
                rowClassName={(record, index) => {
                  const previousIndex = previousOrder.findIndex(q => q.id === record.id);
                  return randomized && previousIndex !== -1 && previousIndex !== index 
                    ? 'highlighted-row' 
                    : '';
                }}
              />
            </>
          )}
        </Space>
      </Card>
    </PageContainer>
  );
};

export default ExamDetail; 