import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Space, Divider } from 'antd';
import { connect, Dispatch } from 'umi';
import { HistoryOutlined } from '@ant-design/icons';
import GameHistory from '@/components/GameHistory';
import styles from './index.less';
import { Choice, GameResult, GameModelType } from '@/models/game';
import { choiceToEmoji, choiceToVietnamese, resultToVietnamese, resultToColor } from '@/utils/rockPaperScissors';

const { Title, Text } = Typography;

interface RockPaperScissorsProps {
  dispatch: Dispatch;
  game: {
    playerChoice: Choice;
    computerChoice: Choice;
    result: GameResult;
    score: {
      player: number;
      computer: number;
    };
    history: any[];
  };
}

const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({ dispatch, game }) => {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const showHistory = () => {
    setIsHistoryVisible(true);
  };

  const handleMakeChoice = (choice: Choice) => {
    dispatch({
      type: 'game/makeChoice',
      payload: choice,
    });
  };

  const handleResetGame = () => {
    dispatch({ type: 'game/resetGame' });
  };

  const handleResetScore = () => {
    dispatch({ type: 'game/resetScore' });
  };

  return (
    <Card className={styles.gameCard}>
      <Title level={2} style={{ textAlign: 'center' }}>Oẳn Tù Tì</Title>
      
      <Row gutter={16} justify="center" style={{ marginBottom: 24 }}>
        <Col>
          <Card title="Điểm số" className={styles.scoreCard}>
            <Row justify="space-between">
              <Col>
                <Text strong>Bạn: {game.score.player}</Text>
              </Col>
              <Col>
                <Text strong>Máy: {game.score.computer}</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} justify="center" className={styles.choicesDisplay}>
        <Col className={styles.playerChoice}>
          <Title level={4}>Bạn chọn</Title>
          <div className={styles.choiceEmoji}>
            {choiceToEmoji(game.playerChoice)}
          </div>
          <Text>{choiceToVietnamese(game.playerChoice)}</Text>
        </Col>
        
        <Col className={styles.vsColumn}>
          <Title level={3}>VS</Title>
        </Col>
        
        <Col className={styles.computerChoice}>
          <Title level={4}>Máy chọn</Title>
          <div className={styles.choiceEmoji}>
            {choiceToEmoji(game.computerChoice)}
          </div>
          <Text>{choiceToVietnamese(game.computerChoice)}</Text>
        </Col>
      </Row>

      {game.result && (
        <div className={styles.resultContainer}>
          <Title level={2} style={{ color: resultToColor(game.result) }}>
            {resultToVietnamese(game.result)}
          </Title>
        </div>
      )}

      <Divider />

      <Title level={4} style={{ textAlign: 'center' }}>Chọn của bạn:</Title>
      <Row gutter={16} justify="center" className={styles.choiceButtons}>
        <Col>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => handleMakeChoice('rock')}
            className={styles.choiceButton}
          >
            <span className={styles.buttonEmoji}>👊</span>
            <span>Búa</span>
          </Button>
        </Col>
        <Col>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => handleMakeChoice('paper')}
            className={styles.choiceButton}
          >
            <span className={styles.buttonEmoji}>✋</span>
            <span>Bao</span>
          </Button>
        </Col>
        <Col>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => handleMakeChoice('scissors')}
            className={styles.choiceButton}
          >
            <span className={styles.buttonEmoji}>✌️</span>
            <span>Kéo</span>
          </Button>
        </Col>
      </Row>

      <Row justify="center" style={{ marginTop: 24 }}>
        <Space>
          <Button onClick={handleResetGame}>Chơi lại</Button>
          <Button danger onClick={handleResetScore}>Đặt lại điểm</Button>
          <Button 
            type="primary" 
            icon={<HistoryOutlined />}
            onClick={showHistory}
          >
            Lịch sử
          </Button>
        </Space>
      </Row>

      <GameHistory
        visible={isHistoryVisible}
        onClose={() => setIsHistoryVisible(false)}
      />
    </Card>
  );
};

export default connect(({ game }: { game: GameModelType['state'] }) => ({
  game,
}))(RockPaperScissors); 