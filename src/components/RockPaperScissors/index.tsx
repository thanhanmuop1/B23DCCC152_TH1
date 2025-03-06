import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Typography, Space, Divider } from 'antd';
import { connect, Dispatch } from 'umi';
import { HistoryOutlined } from '@ant-design/icons';
import GameHistory from '@/components/GameHistory';
import styles from './index.less';

const { Title, Text } = Typography;

interface RockPaperScissorsProps {
  dispatch: Dispatch;
}

const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({ dispatch }) => {
  const [playerChoice, setPlayerChoice] = useState<'rock' | 'paper' | 'scissors' | null>(null);
  const [computerChoice, setComputerChoice] = useState<'rock' | 'paper' | 'scissors' | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    dispatch({ type: 'gameHistory/fetch' });
  }, []);

  const choiceToEmoji = (choice: 'rock' | 'paper' | 'scissors' | null): string => {
    switch (choice) {
      case 'rock': return '👊';
      case 'paper': return '✋';
      case 'scissors': return '✌️';
      default: return '❓';
    }
  };

  const choiceToVietnamese = (choice: 'rock' | 'paper' | 'scissors' | null): string => {
    switch (choice) {
      case 'rock': return 'Búa';
      case 'paper': return 'Bao';
      case 'scissors': return 'Kéo';
      default: return '';
    }
  };

  const resultToVietnamese = (gameResult: 'win' | 'lose' | 'draw' | null): string => {
    switch (gameResult) {
      case 'win': return 'Bạn thắng!';
      case 'lose': return 'Bạn thua!';
      case 'draw': return 'Hòa!';
      default: return '';
    }
  };

  const resultToColor = (gameResult: 'win' | 'lose' | 'draw' | null): string => {
    switch (gameResult) {
      case 'win': return '#52c41a';
      case 'lose': return '#f5222d';
      case 'draw': return '#faad14';
      default: return '';
    }
  };

  const getComputerChoice = (): 'rock' | 'paper' | 'scissors' => {
    const choices: ('rock' | 'paper' | 'scissors')[] = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (
    player: 'rock' | 'paper' | 'scissors',
    computer: 'rock' | 'paper' | 'scissors'
  ): 'win' | 'lose' | 'draw' => {
    if (player === computer) return 'draw';
    
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    
    return 'lose';
  };

  const makeChoice = (choice: 'rock' | 'paper' | 'scissors') => {
    const computer = getComputerChoice();
    const gameResult = determineWinner(choice, computer);
    
    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(gameResult);
    
    setScore(prev => ({
      player: gameResult === 'win' ? prev.player + 1 : prev.player,
      computer: gameResult === 'lose' ? prev.computer + 1 : prev.computer,
    }));

    // Add to history
    dispatch({
      type: 'gameHistory/add',
      payload: {
        playerChoice: choice,
        computerChoice: computer,
        result: gameResult,
      },
    });
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const resetScore = () => {
    setScore({ player: 0, computer: 0 });
    dispatch({ type: 'gameHistory/clear' });
    resetGame();
  };

  const showHistory = () => {
    setIsHistoryVisible(true);
  };

  return (
    <Card className={styles.gameCard}>
      <Title level={2} style={{ textAlign: 'center' }}>Oẳn Tù Tì</Title>
      
      <Row gutter={16} justify="center" style={{ marginBottom: 24 }}>
        <Col>
          <Card title="Điểm số" className={styles.scoreCard}>
            <Row justify="space-between">
              <Col>
                <Text strong>Bạn: {score.player}</Text>
              </Col>
              <Col>
                <Text strong>Máy: {score.computer}</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} justify="center" className={styles.choicesDisplay}>
        <Col className={styles.playerChoice}>
          <Title level={4}>Bạn chọn</Title>
          <div className={styles.choiceEmoji}>
            {choiceToEmoji(playerChoice)}
          </div>
          <Text>{choiceToVietnamese(playerChoice)}</Text>
        </Col>
        
        <Col className={styles.vsColumn}>
          <Title level={3}>VS</Title>
        </Col>
        
        <Col className={styles.computerChoice}>
          <Title level={4}>Máy chọn</Title>
          <div className={styles.choiceEmoji}>
            {choiceToEmoji(computerChoice)}
          </div>
          <Text>{choiceToVietnamese(computerChoice)}</Text>
        </Col>
      </Row>

      {result && (
        <div className={styles.resultContainer}>
          <Title level={2} style={{ color: resultToColor(result) }}>
            {resultToVietnamese(result)}
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
            onClick={() => makeChoice('rock')}
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
            onClick={() => makeChoice('paper')}
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
            onClick={() => makeChoice('scissors')}
            className={styles.choiceButton}
          >
            <span className={styles.buttonEmoji}>✌️</span>
            <span>Kéo</span>
          </Button>
        </Col>
      </Row>

      <Row justify="center" style={{ marginTop: 24 }}>
        <Space>
          <Button onClick={resetGame}>Chơi lại</Button>
          <Button danger onClick={resetScore}>Đặt lại điểm</Button>
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

export default connect()(RockPaperScissors); 