import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Row, Col, Space, message, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { subjectService } from '@/services/ExamBank/MonHoc/subjects';
import { listOfKnowledgeService } from '@/services/ExamBank/DanhMucKKT/listOfKnowledge';
import type { Subject } from '@/models/ExamBank/subjects';
import type { ListOfKnowledge } from '@/models/ExamBank/listOfKnowledge';
import type { SearchParams } from '@/services/ExamBank/search';

interface SearchFormProps {
  loading?: boolean;
  onSearch: (values: SearchParams) => void;
  onReset: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  loading = false,
  onSearch,
  onReset,
}) => {
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<ListOfKnowledge[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Fetch subjects and knowledge categories
  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const [subjectsRes, categoriesRes] = await Promise.all([
          subjectService.getAll(),
          listOfKnowledgeService.getAll(),
        ]);
        
        setSubjects(subjectsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        message.error('Không thể tải dữ liệu bộ lọc');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const isLoading = loading || fetchLoading;

  return (
    <Card 
      title="Tìm kiếm câu hỏi" 
      bordered={false} 
      style={{ marginBottom: 16 }}
      extra={
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={isLoading}
          >
            Tìm kiếm
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
          >
            Đặt lại
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="horizontal">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="Môn học" name="subjectId">
              <Select
                placeholder="Chọn môn học"
                allowClear
                showSearch
                optionFilterProp="children"
                loading={isLoading}
                style={{ width: '100%' }}
              >
                {subjects.map((subject) => (
                  <Select.Option key={subject.id} value={subject.ma_mon}>
                    {`${subject.ma_mon} - ${subject.ten_mon}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Mức độ" name="difficultyLevel">
              <Select 
                placeholder="Chọn mức độ" 
                allowClear
                style={{ width: '100%' }}
              >
                <Select.Option value="Dễ">Dễ</Select.Option>
                <Select.Option value="Trung bình">Trung bình</Select.Option>
                <Select.Option value="Khó">Khó</Select.Option>
                <Select.Option value="Rất khó">Rất khó</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Khối kiến thức" name="knowledgeCategoryId">
              <Select
                placeholder="Chọn khối kiến thức"
                allowClear
                showSearch
                optionFilterProp="children"
                loading={isLoading}
                style={{ width: '100%' }}
              >
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.ten_danh_muc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchForm; 