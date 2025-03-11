export const choiceToEmoji = (choice: Choice): string => {
  switch (choice) {
    case 'rock': return '👊';
    case 'paper': return '✋';
    case 'scissors': return '✌️';
    default: return '❓';
  }
};

export const choiceToVietnamese = (choice: Choice): string => {
  switch (choice) {
    case 'rock': return 'Búa';
    case 'paper': return 'Bao';
    case 'scissors': return 'Kéo';
    default: return '';
  }
};

export const resultToVietnamese = (gameResult: GameResult): string => {
  switch (gameResult) {
    case 'win': return 'Bạn thắng!';
    case 'lose': return 'Bạn thua!';
    case 'draw': return 'Hòa!';
    default: return '';
  }
};

export const resultToColor = (gameResult: GameResult): string => {
  switch (gameResult) {
    case 'win': return '#52c41a';
    case 'lose': return '#f5222d';
    case 'draw': return '#faad14';
    default: return '';
  }
}; 