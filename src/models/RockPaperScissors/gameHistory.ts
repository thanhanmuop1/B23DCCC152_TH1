import { Effect, Reducer } from 'umi';
import { message } from 'antd';

export interface GameHistoryModelState {
  list: GameHistoryItem[];
  loading: boolean;
}

export interface GameHistoryItem {
  id: string;
  playerChoice: 'rock' | 'paper' | 'scissors';
  computerChoice: 'rock' | 'paper' | 'scissors';
  result: 'win' | 'lose' | 'draw';
  timestamp: number;
}

export interface GameHistoryModelType {
  namespace: 'gameHistory';
  state: GameHistoryModelState;
  effects: {
    fetch: Effect;
    add: Effect;
    clear: Effect;
  };
  reducers: {
    save: Reducer<GameHistoryModelState>;
    addHistory: Reducer<GameHistoryModelState>;
    clearHistory: Reducer<GameHistoryModelState>;
  };
}

const GameHistoryModel: GameHistoryModelType = {
  namespace: 'gameHistory',

  state: {
    list: [],
    loading: false,
  },

  effects: {
    *fetch(_, { put }) {
      const historyData = localStorage.getItem('gameHistory');
      const list = historyData ? JSON.parse(historyData) : [];
      yield put({
        type: 'save',
        payload: { list },
      });
    },

    *add({ payload }, { put }) {
      const historyData = localStorage.getItem('gameHistory');
      const list = historyData ? JSON.parse(historyData) : [];
      const newHistory = {
        id: Date.now().toString(),
        ...payload,
        timestamp: Date.now(),
      };
      
      const updatedList = [newHistory, ...list];
      localStorage.setItem('gameHistory', JSON.stringify(updatedList));

      yield put({
        type: 'addHistory',
        payload: newHistory,
      });
    },

    *clear(_, { put }) {
      localStorage.removeItem('gameHistory');
      yield put({ type: 'clearHistory' });
      message.success('Đã xóa lịch sử');
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    addHistory(state, { payload }) {
      return {
        ...state,
        list: [payload, ...state.list],
      };
    },

    clearHistory(state) {
      return {
        ...state,
        list: [],
      };
    },
  },
};

export default GameHistoryModel; 