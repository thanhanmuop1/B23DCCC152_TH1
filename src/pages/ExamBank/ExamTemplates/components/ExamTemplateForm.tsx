import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ExamTemplate, ExamTemplateRequest, StructureType } from '@/models/ExamBank/examTemplate';
import { useSubjects } from '@/hooks/ExamBank/useSubjects';

interface ExamTemplateFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ExamTemplateRequest) => void;
  initialValues?: ExamTemplate | null;
}

const difficultyLevels = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const ExamTemplateForm: React.FC<ExamTemplateFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const structureType = Form.useWatch('loai_cau_truc', form);
  const { subjects, fetchSubjects } = useSubjects();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ten_cau_truc: initialValues.ten_cau_truc,
          mon_hoc_id: initialValues.mon_hoc_id,
          loai_cau_truc: initialValues.loai_cau_truc,
          chi_tiet: initialValues.chi_tiet.map(detail => ({
            muc_do: detail.muc_do,
            so_luong: detail.so_luong,
            phan_tram: detail.phan_tram,
          })),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          loai_cau_truc: 'so_luong',
          chi_tiet: [{ muc_do: 'Dễ', so_luong: 1 }],
        });
      }
    }
  }, [visible, initialValues, form, fetchSubjects]);

  const handleStructureTypeChange = (type: StructureType) => {
    // Reset chi tiết khi đổi loại
    form.setFieldsValue({
      chi_tiet: [
        {
          muc_do: 'Dễ',
          [type === 'so_luong' ? 'so_luong' : 'phan_tram']: type === 'so_luong' ? 1 : 100,
        },
      ],
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Xóa trường không sử dụng dựa vào loại cấu trúc
      values.chi_tiet = values.chi_tiet.map((detail: any) => ({
        muc_do: detail.muc_do,
        [values.loai_cau_truc === 'so_luong' ? 'so_luong' : 'phan_tram']:
          values.loai_cau_truc === 'so_luong' ? detail.so_luong : detail.phan_tram,
      }));
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Tính tổng phần trăm hiện tại
  const calculateTotalPercentage = () => {
    const details = form.getFieldValue('chi_tiet') || [];
    return details.reduce((sum: number, detail: any) => sum + (detail.phan_tram || 0), 0);
  };

  return (
    <Modal
      title={initialValues ? 'Sửa cấu trúc đề thi' : 'Thêm cấu trúc đề thi mới'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="mon_hoc_id"
          label="Môn học"
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select
            placeholder="Chọn môn học"
            showSearch
            optionFilterProp="children"
          >
            {subjects.map(subject => (
              <Select.Option key={subject.id} value={subject.id}>
                {subject.ma_mon} - {subject.ten_mon}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="ten_cau_truc"
          label="Tên cấu trúc"
          rules={[{ required: true, message: 'Vui lòng nhập tên cấu trúc' }]}
        >
          <Input placeholder="Nhập tên cấu trúc đề thi" />
        </Form.Item>

        <Form.Item
          name="loai_cau_truc"
          label="Loại cấu trúc"
          rules={[{ required: true, message: 'Vui lòng chọn loại cấu trúc' }]}
        >
          <Radio.Group onChange={e => handleStructureTypeChange(e.target.value)}>
            <Radio.Button value="so_luong">Theo số lượng</Radio.Button>
            <Radio.Button value="phan_tram">Theo phần trăm</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {structureType === 'phan_tram' && (
          <div style={{ marginBottom: 16 }}>
            Tổng phần trăm hiện tại: {calculateTotalPercentage()}%
            {calculateTotalPercentage() !== 100 && (
              <span style={{ color: 'red' }}> (Yêu cầu tổng phải bằng 100%)</span>
            )}
          </div>
        )}

        <Form.List name="chi_tiet">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ display: 'flex', marginBottom: 8, gap: 8 }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'muc_do']}
                    rules={[{ required: true, message: 'Chọn mức độ' }]}
                    style={{ flex: 1 }}
                  >
                    <Select placeholder="Chọn mức độ">
                      {difficultyLevels.map(level => (
                        <Select.Option key={level} value={level}>
                          {level}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, structureType === 'so_luong' ? 'so_luong' : 'phan_tram']}
                    rules={[
                      { required: true, message: `Nhập ${structureType === 'so_luong' ? 'số lượng' : 'phần trăm'}` },
                      {
                        validator: async (_, value) => {
                          if (structureType === 'phan_tram') {
                            if (value <= 0 || value > 100) {
                              throw new Error('Phần trăm phải từ 1 đến 100');
                            }
                          } else {
                            if (value <= 0) {
                              throw new Error('Số lượng phải lớn hơn 0');
                            }
                          }
                        },
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <InputNumber
                      min={1}
                      max={structureType === 'phan_tram' ? 100 : undefined}
                      placeholder={structureType === 'so_luong' ? 'Số lượng' : 'Phần trăm'}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  )}
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm mức độ
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ExamTemplateForm; 