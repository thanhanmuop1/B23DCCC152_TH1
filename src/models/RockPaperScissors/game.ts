import { Effect, Reducer } from 'umi';
import { message } from 'antd';

export type Choice = 'rock' | 'paper' | 'scissors' | null;
export type GameResult = 'win' | 'lose' | 'draw' | null;

interface GameState {
  playerChoice: Choice;
  computerChoice: Choice;
  result: GameResult;
  score: {
    player: number;
    computer: number;
  };
  history: {
    id: string;
    playerChoice: Choice;
    computerChoice: Choice;
    result: GameResult;
    timestamp: number;
  }[];
  loading: boolean;
}

export interface GameModelType {
  namespace: 'game';
  state: GameState;
  effects: {
    makeChoice: Effect;
    fetchHistory: Effect;
    clearHistory: Effect;
  };
  reducers: {
    updateGame: Reducer<GameState>;
    resetGame: Reducer<GameState>;
    resetScore: Reducer<GameState>;
    setHistory: Reducer<GameState>;
  };
}

const GameModel: GameModelType = {
  namespace: 'game',
  
  state: {
    playerChoice: null,
    computerChoice: null,
    result: null,
    score: {
      player: 0,
      computer: 0,
    },
    history: [],
    loading: false,
  },

  effects: {
    *makeChoice({ payload }, { put }) {
      const choice = payload as Choice;
      const choices: Choice[] = ['rock', 'paper', 'scissors'];
      const computerChoice = choices[Math.floor(Math.random() * choices.length)];
      
      let result: GameResult = 'draw';
      if (choice === computerChoice) {
        result = 'draw';
      } else if (
        (choice === 'rock' && computerChoice === 'scissors') ||
        (choice === 'paper' && computerChoice === 'rock') ||
        (choice === 'scissors' && computerChoice === 'paper')
      ) {
        result = 'win';
      } else {
        result = 'lose';
      }

      // Tạo item lịch sử mới
      const historyItem = {
        id: Date.now().toString(),
        playerChoice: choice,
        computerChoice,
        result,
        timestamp: Date.now(),
      };

      // Lưu vào localStorage
      const historyData = localStorage.getItem('gameHistory');
      const currentHistory = historyData ? JSON.parse(historyData) : [];
      localStorage.setItem('gameHistory', JSON.stringify([historyItem, ...currentHistory]));

      yield put({
        type: 'updateGame',
        payload: {
          playerChoice: choice,
          computerChoice,
          result,
          historyItem,
        },
      });
    },

    *fetchHistory(_, { put }) {
      const historyData = localStorage.getItem('gameHistory');
      const history = historyData ? JSON.parse(historyData) : [];
      yield put({
        type: 'setHistory',
        payload: history,
      });
    },

    *clearHistory(_, { put }) {
      localStorage.removeItem('gameHistory');
      yield put({ type: 'resetScore' });
      message.success('Đã xóa lịch sử');
    },
  },

  reducers: {
    updateGame(state = GameModel.state, { payload }) {
      const { playerChoice, computerChoice, result, historyItem } = payload;
      return {
        ...state,
        playerChoice,
        computerChoice,
        result,
        score: {
          player: result === 'win' ? state.score.player + 1 : state.score.player,
          computer: result === 'lose' ? state.score.computer + 1 : state.score.computer,
        },
        history: [historyItem, ...state.history],
      };
    },

    setHistory(state = GameModel.state, { payload }) {
      return {
        ...state,
        history: payload,
      };
    },

    resetGame(state = GameModel.state) {
      return {
        ...state,
        playerChoice: null,
        computerChoice: null,
        result: null,
      };
    },

    resetScore(state = GameModel.state) {
      return {
        ...state,
        playerChoice: null,
        computerChoice: null,
        result: null,
        score: {
          player: 0,
          computer: 0,
        },
        history: [],
      };
    },
  },
};

export default GameModel; 