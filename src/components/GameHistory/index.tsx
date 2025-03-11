import React from 'react';
import { Modal, List, Typography } from 'antd';
import { connect } from 'umi';
import { Choice, GameResult } from '@/models/game';
import { choiceToEmoji, choiceToVietnamese, resultToVietnamese, resultToColor } from '@/utils/rockPaperScissors';
import styles from './index.less';

const { Text } = Typography;

interface GameHistoryProps {
  visible: boolean;
  onClose: () => void;
  game: {
    history: {
      playerChoice: Choice;
      computerChoice: Choice;
      result: GameResult;
      timestamp: number;
    }[];
  };
}

const GameHistory: React.FC<GameHistoryProps> = ({ visible, onClose, game }) => {
  return (
    <Modal
      title="Lịch sử chơi"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <List
        dataSource={game.history}
        renderItem={(item) => (
          <List.Item className={styles.historyItem}>
            <div className={styles.moveInfo}>
              <Text>Bạn: </Text>
              <Text strong>
                {choiceToEmoji(item.playerChoice)} {choiceToVietnamese(item.playerChoice)}
              </Text>
            </div>
            <div className={styles.moveInfo}>
              <Text>Máy: </Text>
              <Text strong>
                {choiceToEmoji(item.computerChoice)} {choiceToVietnamese(item.computerChoice)}
              </Text>
            </div>
            <div className={styles.result}>
              <Text style={{ color: resultToColor(item.result) }}>
                {resultToVietnamese(item.result)}
              </Text>
            </div>
            <div className={styles.timestamp}>
              <Text type="secondary">
                {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </div>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default connect(({ game }: { game: { history: any[] } }) => ({
  game,
}))(GameHistory); 