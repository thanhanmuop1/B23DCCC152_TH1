import React from 'react';
import { Modal, Table, Typography, Space } from 'antd';
import { connect, Dispatch } from 'umi';
import { GameHistoryItem } from '@/models/RockPaperScissors/gameHistory';
import styles from './index.less';

const { Text } = Typography;

interface GameHistoryProps {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  historyList: GameHistoryItem[];
  dispatch: Dispatch;
}

const GameHistory: React.FC<GameHistoryProps> = ({
  visible,
  onClose,
  loading,
  historyList,
  dispatch,
}) => {
  const choiceToEmoji = (choice: 'rock' | 'paper' | 'scissors'): string => {
    switch (choice) {
      case 'rock': return '👊';
      case 'paper': return '✋';
      case 'scissors': return '✌️';
      default: return '❓';
    }
  };

  const choiceToVietnamese = (choice: 'rock' | 'paper' | 'scissors'): string => {
    switch (choice) {
      case 'rock': return 'Búa';
      case 'paper': return 'Bao';
      case 'scissors': return 'Kéo';
      default: return '';
    }
  };

  const resultToVietnamese = (result: 'win' | 'lose' | 'draw'): string => {
    switch (result) {
      case 'win': return 'Bạn thắng!';
      case 'lose': return 'Bạn thua!';
      case 'draw': return 'Hòa!';
      default: return '';
    }
  };

  const resultToColor = (result: 'win' | 'lose' | 'draw'): string => {
    switch (result) {
      case 'win': return '#52c41a';
      case 'lose': return '#f5222d';
      case 'draw': return '#faad14';
      default: return '';
    }
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleString('vi-VN'),
    },
    {
      title: 'Bạn chọn',
      dataIndex: 'playerChoice',
      key: 'playerChoice',
      render: (choice: 'rock' | 'paper' | 'scissors') => (
        <Space>
          {choiceToEmoji(choice)}
          {choiceToVietnamese(choice)}
        </Space>
      ),
    },
    {
      title: 'Máy chọn',
      dataIndex: 'computerChoice',
      key: 'computerChoice',
      render: (choice: 'rock' | 'paper' | 'scissors') => (
        <Space>
          {choiceToEmoji(choice)}
          {choiceToVietnamese(choice)}
        </Space>
      ),
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (result: 'win' | 'lose' | 'draw') => (
        <Text strong style={{ color: resultToColor(result) }}>
          {resultToVietnamese(result)}
        </Text>
      ),
    },
  ];

  return (
    <Modal
      title="Lịch sử các ván đấu"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.historyModal}
    >
      <Table
        loading={loading}
        dataSource={historyList}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />
    </Modal>
  );
};

export default connect(({ gameHistory, loading }: {
  gameHistory: { list: GameHistoryItem[] };
  loading: { effects: { [key: string]: boolean } };
}) => ({
  historyList: gameHistory.list,
  loading: loading.effects['gameHistory/fetch'],
}))(GameHistory); 