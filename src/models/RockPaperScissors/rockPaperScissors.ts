import { useState, useEffect } from 'react';

export type Choice = 'rock' | 'paper' | 'scissors' | null;

export interface GameResult {
  playerChoice: Choice;
  computerChoice: Choice;
  result: 'win' | 'lose' | 'draw';
  timestamp: number;
}

export interface GameState {
  playerChoice: Choice;
  computerChoice: Choice;
  result: 'win' | 'lose' | 'draw' | null;
  score: {
    player: number;
    computer: number;
  };
  history: GameResult[];
}

export const useRockPaperScissorsGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerChoice: null,
    computerChoice: null,
    result: null,
    score: {
      player: 0,
      computer: 0,
    },
    history: [],
  });

  const getComputerChoice = (): Choice => {
    const choices: Choice[] = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (player: Choice, computer: Choice): 'win' | 'lose' | 'draw' => {
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

  const makeChoice = (choice: Choice) => {
    if (!choice) return;
    
    const computerChoice = getComputerChoice();
    const result = determineWinner(choice, computerChoice);
    
    setGameState(prevState => {
      const newHistory: GameResult = {
        playerChoice: choice,
        computerChoice,
        result,
        timestamp: Date.now(),
      };

      return {
        playerChoice: choice,
        computerChoice,
        result,
        score: {
          player: result === 'win' ? prevState.score.player + 1 : prevState.score.player,
          computer: result === 'lose' ? prevState.score.computer + 1 : prevState.score.computer,
        },
        history: [newHistory, ...prevState.history],
      };
    });
  };

  const resetGame = () => {
    setGameState(prevState => ({
      playerChoice: null,
      computerChoice: null,
      result: null,
      score: prevState.score,
      history: prevState.history,
    }));
  };

  const resetScore = () => {
    setGameState(prevState => ({
      ...prevState,
      score: {
        player: 0,
        computer: 0,
      },
      history: [],
    }));
  };

  return {
    gameState,
    makeChoice,
    resetGame,
    resetScore,
  };
}; 