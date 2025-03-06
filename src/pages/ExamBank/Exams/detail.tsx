import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Descriptions, Table, Tag, Button, Space } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { useParams, history } from 'umi';
import useExam from '@/hooks/ExamBank/useExam';
import type { ExamQuestion } from '@/models/exam';

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, currentExam, fetchExamDetail } = useExam();

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
  const questionsByDifficulty = currentExam?.cau_hoi.reduce((acc, question) => {
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
            </Space>
          </div>

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
                  {currentExam.so_cau_hoi}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo" span={3}>
                  {new Date(currentExam.ngay_tao).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
              </Descriptions>

              <div>
                <h3>Cấu trúc đề thi:</h3>
                {Object.entries(questionsByDifficulty).map(([difficulty, questions]) => (
                  <div key={difficulty}>
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
                columns={columns}
                dataSource={currentExam.cau_hoi}
                rowKey="id"
                pagination={false}
                bordered
              />
            </>
          )}
        </Space>
      </Card>
    </PageContainer>
  );
};

export default ExamDetail; 